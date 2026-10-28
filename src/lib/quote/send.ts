import type { LeadPayload } from "@/lib/quote/payload";

const ID_KEY = "goodbiz-lead-id";
const PENDING_KEY = "goodbiz-lead-pending";
const TIMEOUT_MS = 15_000;

type SendOptions = {
  endpoint: string;
  final: boolean;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  storage?: Storage | null;
};

function safe<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

// One id per visit, kept for the tab so a refresh updates the same sheet row.
export function getLeadId(storage: Storage | null): string {
  const existing = storage && safe(() => storage.getItem(ID_KEY));
  if (existing) return existing;
  const id = randomId();
  if (storage) safe(() => storage.setItem(ID_KEY, id));
  return id;
}

// Text/plain JSON keeps the request "simple", so the browser sends no CORS
// preflight (Apps Script cannot answer one). Resolves true only on {ok:true}.
export async function sendLead(p: LeadPayload, opts: SendOptions): Promise<boolean> {
  const { endpoint, final, timeoutMs = TIMEOUT_MS, fetchImpl = fetch, storage = null } = opts;
  if (!endpoint) return false;
  const body = JSON.stringify(p);
  if (storage) safe(() => storage.setItem(PENDING_KEY, body));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      keepalive: !final,
      signal: controller.signal,
    });
    const data = (await res.json()) as { ok?: unknown };
    if (data?.ok !== true) return false;
    if (storage) {
      // Sends overlap; only clear the stored copy if it is still the one this send wrote.
      if (safe(() => storage.getItem(PENDING_KEY)) === body) safe(() => storage.removeItem(PENDING_KEY));
      // A finished request ends the visit's lead: the next request gets its own row and alert.
      if (final && p.stage === "submitted") safe(() => storage.removeItem(ID_KEY));
    }
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function resendPending(opts: Omit<SendOptions, "final">): Promise<void> {
  const raw = opts.storage && safe(() => opts.storage!.getItem(PENDING_KEY));
  if (!raw) return;
  const p = safe(() => JSON.parse(raw) as LeadPayload);
  if (!p?.leadId) {
    safe(() => opts.storage!.removeItem(PENDING_KEY));
    return;
  }
  await sendLead(p, { ...opts, final: false });
}
