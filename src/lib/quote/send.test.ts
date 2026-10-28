import { buildPayload, fallbackLinks, requestSummary, type LeadPayload } from "@/lib/quote/payload";
import { getLeadId, resendPending, sendLead } from "@/lib/quote/send";
import { emptyAnswers, type Answers } from "@/lib/quote/steps";

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

const answers = (over: Partial<Answers> = {}): Answers => ({
  ...emptyAnswers(),
  name: "Ali",
  email: "ali@example.com",
  product: "lt-panels",
  variety: "motor-control-centre-mcc",
  quantity: "2-5",
  country: "Kenya",
  terms: "cif",
  ...over,
});
const ctx = { leadId: "L1", stage: "contact" as const, prefill: {}, page: "/quote", lang: "en", userAgent: "test" };
const payload = (over: Partial<Answers> = {}): LeadPayload => buildPayload(answers(over), ctx);
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const ENDPOINT = "https://lead.test/exec";

describe("sendLead", () => {
  test("does nothing without an endpoint", async () => {
    const fetchImpl = vi.fn();
    expect(await sendLead(payload(), { endpoint: "", final: true, fetchImpl })).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("posts JSON as text/plain, keepalive only for in-between sends", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ ok: true }));
    await sendLead(payload(), { endpoint: ENDPOINT, final: false, fetchImpl, storage: null });
    await sendLead(payload(), { endpoint: ENDPOINT, final: true, fetchImpl, storage: null });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("text/plain;charset=utf-8");
    expect(JSON.parse(init.body).leadId).toBe("L1");
    expect(init.keepalive).toBe(true);
    expect(fetchImpl.mock.calls[1][1].keepalive).toBe(false);
  });

  test("ok clears the pending copy; failure keeps it", async () => {
    const storage = memoryStorage();
    const ok = vi.fn().mockResolvedValue(json({ ok: true }));
    expect(await sendLead(payload(), { endpoint: ENDPOINT, final: true, fetchImpl: ok, storage })).toBe(true);
    expect(storage.getItem("goodbiz-lead-pending")).toBeNull();

    const bad = vi.fn().mockResolvedValue(json({ ok: false }, 500));
    expect(await sendLead(payload(), { endpoint: ENDPOINT, final: true, fetchImpl: bad, storage })).toBe(false);
    expect(JSON.parse(storage.getItem("goodbiz-lead-pending")!).leadId).toBe("L1");
  });

  test("network errors and non-JSON answers are failures", async () => {
    const reject = vi.fn().mockRejectedValue(new TypeError("offline"));
    expect(await sendLead(payload(), { endpoint: ENDPOINT, final: true, fetchImpl: reject, storage: null })).toBe(false);
    const html = vi.fn().mockResolvedValue(new Response("<html>login</html>"));
    expect(await sendLead(payload(), { endpoint: ENDPOINT, final: true, fetchImpl: html, storage: null })).toBe(false);
  });

  test("times out", async () => {
    const hang = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_, reject) => init?.signal?.addEventListener("abort", () => reject(new Error("aborted"))));
    });
    expect(await sendLead(payload(), { endpoint: ENDPOINT, final: true, fetchImpl: hang, storage: null, timeoutMs: 20 })).toBe(false);
  });

  test("resendPending sends the stored copy once", async () => {
    const storage = memoryStorage();
    storage.setItem("goodbiz-lead-pending", JSON.stringify(payload()));
    const ok = vi.fn().mockResolvedValue(json({ ok: true }));
    await resendPending({ endpoint: ENDPOINT, fetchImpl: ok, storage });
    expect(ok).toHaveBeenCalledTimes(1);
    expect(storage.getItem("goodbiz-lead-pending")).toBeNull();
    await resendPending({ endpoint: ENDPOINT, fetchImpl: ok, storage });
    expect(ok).toHaveBeenCalledTimes(1);
  });
});

test("lead id is stable per tab and works without storage", () => {
  const storage = memoryStorage();
  const first = getLeadId(storage);
  expect(first.length).toBeGreaterThan(8);
  expect(getLeadId(storage)).toBe(first);
  expect(getLeadId(null).length).toBeGreaterThan(8);
});

describe("payload", () => {
  test("sends labels, not ids", () => {
    const p = payload();
    expect(p.product).toBe("LT panels");
    expect(p.variety).toBe("Motor control centre (MCC)");
    expect(p.quantity).toBe("2–5 units");
    expect(p.terms).toBe("CIF your port");
    expect(p.source).toBe("quick");
    expect(p.prefilled).toBe("no");
    expect(buildPayload(answers(), { ...ctx, prefill: { product: "lt-panels" } }).prefilled).toBe("yes");
  });

  test("Something else and Another amount send their text", () => {
    const p = payload({ product: "other", productOther: "cable trays", variety: "", quantity: "other", quantityOther: "40" });
    expect(p.product).toBe("Something else");
    expect(p.productOther).toBe("cable trays");
    expect(p.quantityOther).toBe("40");
  });

  test("summary lists filled fields only", () => {
    const text = requestSummary(payload());
    expect(text).toContain("Country: Kenya");
    expect(text).toContain("Product: LT panels");
    expect(text).not.toContain("Company:");
  });

  test("fallback links carry the whole request", () => {
    const links = fallbackLinks(payload());
    expect(links.whatsapp).toContain("wa.me/");
    expect(links.whatsapp).toContain("text=");
    expect(decodeURIComponent(links.whatsapp)).toContain("Country: Kenya");
    expect(links.email.startsWith("mailto:")).toBe(true);
    expect(decodeURIComponent(links.email)).toContain("Quote request: LT panels for Kenya");
  });
});

describe("review fixes", () => {
  test("a finished request starts a new lead id for the next one", async () => {
    const storage = memoryStorage();
    const first = getLeadId(storage);
    const ok = vi.fn(async () => json({ ok: true }));
    await sendLead({ ...payload(), leadId: first, stage: "quantity" }, { endpoint: ENDPOINT, final: false, fetchImpl: ok, storage });
    expect(getLeadId(storage)).toBe(first);
    await sendLead({ ...payload(), leadId: first, stage: "submitted" }, { endpoint: ENDPOINT, final: true, fetchImpl: ok, storage });
    expect(getLeadId(storage)).not.toBe(first);
  });

  test("a slow earlier success does not delete a later unsent copy", async () => {
    const storage = memoryStorage();
    let releaseSlow: (r: Response) => void = () => {};
    const slow = new Promise<Response>((r) => (releaseSlow = r));
    const fetchImpl = vi
      .fn()
      .mockReturnValueOnce(slow)
      .mockResolvedValueOnce(json({ ok: false }, 500));
    const early = sendLead({ ...payload(), stage: "product" }, { endpoint: ENDPOINT, final: false, fetchImpl, storage });
    await sendLead({ ...payload(), stage: "quantity" }, { endpoint: ENDPOINT, final: false, fetchImpl, storage });
    releaseSlow(json({ ok: true }));
    await early;
    expect(JSON.parse(storage.getItem("goodbiz-lead-pending")!).stage).toBe("quantity");
  });
});
