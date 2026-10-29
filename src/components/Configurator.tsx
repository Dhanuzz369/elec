"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { countries, defaultCountry } from "@/data/countries";
import { families } from "@/data/products";
import { mailtoHref, site, whatsappHref } from "@/data/site";
import type { LeadPayload } from "@/lib/quote/payload";
import { getLeadId, sendLead } from "@/lib/quote/send";
import { TransformerSymbol } from "./Motif";

const PROJECTS = [
  "Process plant",
  "Solar or wind farm",
  "Commercial building",
  "Utility substation",
  "Data centre",
  "Panel builder stock",
  "Other",
];
const IP = ["IP31", "IP42", "IP54", "IP55", "IP65"];
const INCOTERMS = ["FOB Indian port", "CIF destination port", "DAP site", "EXW factory"];
const STEPS = ["Project", "Country & site", "Ratings", "Contact"];
const MV_FAMILIES = new Set(["mv-switchgear-rmu", "transformers"]);

type Form = {
  project: string;
  equipment: string[];
  country: string;
  lv: string;
  mv: string;
  hz: string;
  standard: string;
  conformity: string;
  ambient: string;
  plate: string;
  altitude: string;
  ip: string;
  install: string;
  rating: string;
  quantity: string;
  busbar: string;
  needBy: string;
  notes: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  incoterm: string;
  port: string;
};

function fromCountry(code: string) {
  const c = countries.find((x) => x.code === code) ?? defaultCountry;
  return {
    country: c.code,
    lv: c.lv,
    mv: c.mv,
    hz: `${c.hz} Hz`,
    standard: c.standard,
    conformity: c.conformity,
    ambient: `${c.ambient} °C`,
    plate: c.plate,
  };
}

// Also the server-rendered fallback while the configurator waits for the URL's
// query string, so the page always has its heading in the HTML.
export function ConfiguratorIntro() {
  return (
    <>
      <h1>Configure your requirement</h1>
      <p>
        Four short steps. Pick the destination and we fill in its grid and paperwork; change anything that your
        specification says differently.
      </p>
    </>
  );
}

export function Configurator() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState<false | "sheet" | "email">(false);
  const [sending, setSending] = useState(false);
  const inFlight = useRef(false);
  const [written, setWritten] = useState("");
  const [form, setForm] = useState<Form>(() => ({
    project: "",
    equipment: [],
    ...fromCountry(defaultCountry.code),
    altitude: "below 1000 m",
    ip: "IP42",
    install: "Indoor",
    rating: "",
    quantity: "1",
    busbar: "Copper",
    needBy: "",
    notes: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    incoterm: INCOTERMS[1],
    port: "",
  }));

  useEffect(() => {
    const fam = params.get("family");
    if (fam && families.some((f) => f.slug === fam)) {
      setForm((f) => (f.equipment.includes(fam) ? f : { ...f, equipment: [...f.equipment, fam] }));
    }
    const code = params.get("country")?.toUpperCase();
    if (code && countries.some((c) => c.code === code)) {
      setForm((f) => ({ ...f, ...fromCountry(code) }));
    }
  }, [params]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const toggleEquipment = (slug: string) =>
    setForm((f) => ({
      ...f,
      equipment: f.equipment.includes(slug) ? f.equipment.filter((s) => s !== slug) : [...f.equipment, slug],
    }));

  const country = countries.find((c) => c.code === form.country) ?? defaultCountry;
  const equipmentNames = useMemo(
    () => form.equipment.map((s) => families.find((f) => f.slug === s)?.name ?? s),
    [form.equipment],
  );
  const needsMv = form.equipment.some((s) => MV_FAMILIES.has(s));

  const plateRows = useMemo(
    () => [
      ["Equipment", equipmentNames.length ? equipmentNames.join(", ") : "Choose in step 1"],
      ["Rated voltage", needsMv ? `${form.mv} / ${form.lv}` : form.lv],
      ["Frequency", form.hz],
      ["Built to", form.standard],
      ["Conformity", form.conformity],
      ["Design ambient", `${form.ambient}, ${form.altitude}`],
      ["Enclosure", `${form.ip}, ${form.install.toLowerCase()}`],
      ["Busbar / winding", form.busbar],
      ["Rating", form.rating || "To your SLD"],
      ["Quantity", form.quantity || "1"],
      ["Nameplate", form.plate],
    ],
    [equipmentNames, needsMv, form],
  );

  // Flash the plate cells whose value changed, once the buyer pauses: a flash
  // on every keystroke would restart and flicker while they type.
  const prev = useRef<string[]>([]);
  const [changed, setChanged] = useState<Set<number>>(new Set());
  useEffect(() => {
    const values = plateRows.map((r) => r[1]);
    if (!prev.current.length) {
      prev.current = values;
      return;
    }
    const settle = window.setTimeout(() => {
      const diff = new Set<number>();
      values.forEach((v, i) => prev.current[i] !== v && diff.add(i));
      prev.current = values;
      if (diff.size) setChanged(diff);
    }, 280);
    return () => window.clearTimeout(settle);
  }, [plateRows]);

  useEffect(() => {
    if (!changed.size) return;
    const t = window.setTimeout(() => setChanged(new Set()), 720);
    return () => window.clearTimeout(t);
  }, [changed]);

  const canNext = step === 0 ? form.equipment.length > 0 : step === 3 ? !!(form.name && form.email) : true;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      if (canNext) setStep(step + 1);
      return;
    }
    const lines = [
      `Project: ${form.project || "not given"}`,
      `Equipment: ${equipmentNames.join(", ")}`,
      `Destination: ${country.name}`,
      ...plateRows.slice(1).map(([k, v]) => `${k}: ${v}`),
      `Required by: ${form.needBy || "not given"}`,
      `Incoterm: ${form.incoterm}${form.port ? `, ${form.port}` : ""}`,
      "",
      `Notes: ${form.notes || "none"}`,
      "",
      `${form.name}${form.company ? `, ${form.company}` : ""}`,
      form.email,
      form.phone,
      "",
      "(Please attach your SLD, BOQ or specification to this email.)",
    ];
    const subject = `Enquiry: ${equipmentNames.join(", ")} for ${country.name}`;
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    // Saved to the lead sheet first; if that fails the written email opens as before.
    const storage = (() => {
      try {
        return window.sessionStorage;
      } catch {
        return null;
      }
    })();
    const lead: LeadPayload = {
      leadId: getLeadId(storage),
      stage: "submitted",
      source: "configurator",
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      product: equipmentNames.join(", "),
      productOther: "",
      variety: "",
      quantity: form.quantity,
      quantityOther: "",
      country: country.name,
      port: form.port,
      terms: form.incoterm,
      notes: form.notes,
      // Everything above the contact block: equipment, country, plate ratings, terms and notes.
      details: lines.slice(0, -6).join("\n"),
      page: window.location.pathname + window.location.search,
      prefilled: "no",
      lang: document.documentElement.lang || "en",
      userAgent: navigator.userAgent,
    };
    const ok = await sendLead(lead, { endpoint: site.leadEndpoint, final: true, storage });
    inFlight.current = false;
    setSending(false);
    if (ok) {
      setSent("sheet");
      return;
    }
    setWritten(lines.join("\n"));
    window.location.href = mailtoHref(subject, lines.join("\n"));
    setSent("email");
  }

  return (
    <div className="config">
      <form className="config-form" onSubmit={submit} noValidate>
        <ConfiguratorIntro />

        <div className="stepper" role="list">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              role="listitem"
              aria-current={i === step ? "step" : undefined}
              data-done={i < step}
              onClick={() => (i <= step || canNext) && setStep(i)}
            >
              {s}
            </button>
          ))}
        </div>

        {sent ? (
          <div className="sent">
            {sent === "sheet" ? (
              <>
                <h2 style={{ fontSize: "var(--step-lead)" }}>Thanks, we&apos;ve got your request</h2>
                <p>
                  Our export desk replies within one working day. To share a single-line diagram, BOQ or specification,
                  reply to our email with it attached.
                </p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: "var(--step-lead)" }}>Your email app should now be open</h2>
                <p>
                  The enquiry is written for you. Attach your single-line diagram, BOQ or specification and send it;
                  our export desk replies within one working day.
                </p>
                <a className="btn" href={whatsappHref(written)} title="Send this requirement on WhatsApp">
                  Send on WhatsApp instead
                </a>
              </>
            )}
            <button type="button" className="btn btn--quiet" onClick={() => setSent(false)}>
              Back to the form
            </button>
          </div>
        ) : (
          <>
            {step === 0 && (
              <fieldset key="step-0">
                <legend>What are you building, and what do you need?</legend>
                <div className="field">
                  <span className="label">Project type</span>
                  <div className="chips">
                    {PROJECTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="chip"
                        aria-pressed={form.project === p}
                        onClick={() => set("project", form.project === p ? "" : p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <span className="label">Equipment, choose one or more</span>
                  <div className="chips">
                    {families.map((f) => (
                      <button
                        key={f.slug}
                        type="button"
                        className="chip"
                        aria-pressed={form.equipment.includes(f.slug)}
                        onClick={() => toggleEquipment(f.slug)}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset key="step-1">
                <legend>Where is it going?</legend>
                <div className="field">
                  <label htmlFor="country">Destination country</label>
                  <select
                    id="country"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, ...fromCountry(e.target.value) }))}
                  >
                    {["Gulf", "Africa", "Asia", "Oceania", "Europe", "Americas"].map((region) => (
                      <optgroup key={region} label={region}>
                        {countries
                          .filter((c) => c.region === region)
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                  <span className="hint">
                    Not listed? Choose the nearest and edit the fields below. We ship to any country.
                  </span>
                </div>
                <div className="two">
                  <div className="field">
                    <label htmlFor="lv">Low voltage</label>
                    <input id="lv" value={form.lv} onChange={(e) => set("lv", e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="mv">Medium voltage</label>
                    <input id="mv" value={form.mv} onChange={(e) => set("mv", e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="hz">Frequency</label>
                    <select id="hz" value={form.hz} onChange={(e) => set("hz", e.target.value)}>
                      <option>50 Hz</option>
                      <option>60 Hz</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ambient">Design ambient</label>
                    <input id="ambient" value={form.ambient} onChange={(e) => set("ambient", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="standard">Standards</label>
                  <input id="standard" value={form.standard} onChange={(e) => set("standard", e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="conformity">Certification and approvals</label>
                  <input
                    id="conformity"
                    value={form.conformity}
                    onChange={(e) => set("conformity", e.target.value)}
                  />
                </div>
                <div className="two">
                  <div className="field">
                    <span className="label">Enclosure rating</span>
                    <div className="chips">
                      {IP.map((ip) => (
                        <button
                          key={ip}
                          type="button"
                          className="chip"
                          aria-pressed={form.ip === ip}
                          onClick={() => set("ip", ip)}
                        >
                          {ip}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <span className="label">Installation</span>
                    <div className="chips">
                      {["Indoor", "Outdoor"].map((v) => (
                        <button
                          key={v}
                          type="button"
                          className="chip"
                          aria-pressed={form.install === v}
                          onClick={() => set("install", v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="two">
                  <div className="field">
                    <label htmlFor="altitude">Site altitude</label>
                    <input id="altitude" value={form.altitude} onChange={(e) => set("altitude", e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="plate">Nameplate language</label>
                    <input id="plate" value={form.plate} onChange={(e) => set("plate", e.target.value)} />
                  </div>
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset key="step-2">
                <legend>Ratings and quantity</legend>
                <div className="field">
                  <label htmlFor="rating">Main rating</label>
                  <input
                    id="rating"
                    placeholder="e.g. 4000 A PCC, 1000 kVA 11/0.433 kV, 3-way RMU 33 kV"
                    value={form.rating}
                    onChange={(e) => set("rating", e.target.value)}
                  />
                </div>
                <div className="two">
                  <div className="field">
                    <label htmlFor="qty">Quantity</label>
                    <input
                      id="qty"
                      inputMode="numeric"
                      value={form.quantity}
                      onChange={(e) => set("quantity", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="needBy">Needed on site by</label>
                    <input id="needBy" type="month" value={form.needBy} onChange={(e) => set("needBy", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <span className="label">Busbar or winding material</span>
                  <div className="chips">
                    {["Copper", "Aluminium", "Either"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        className="chip"
                        aria-pressed={form.busbar === v}
                        onClick={() => set("busbar", v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="notes">Anything else</label>
                  <textarea
                    id="notes"
                    placeholder="Preferred breaker brand, feeder list, tender number, special tests…"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                  <span className="hint">You can attach your SLD, BOQ or specification to the email in the last step.</span>
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset key="step-3">
                <legend>Where should we send the quote?</legend>
                <div className="two">
                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input id="name" autoComplete="name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone or WhatsApp</label>
                    <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="incoterm">Delivery terms</label>
                    <select id="incoterm" value={form.incoterm} onChange={(e) => set("incoterm", e.target.value)}>
                      {INCOTERMS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="port">Destination port or city</label>
                    <input
                      id="port"
                      placeholder="e.g. Jebel Ali, Lagos, Mombasa"
                      value={form.port}
                      onChange={(e) => set("port", e.target.value)}
                    />
                  </div>
                </div>
              </fieldset>
            )}

            <div className="form-nav">
              {step > 0 ? (
                <button type="button" className="btn btn--quiet" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="btn" disabled={!canNext || sending} aria-disabled={!canNext || sending}>
                {step < 3 ? "Next" : sending ? "Sending…" : "Send enquiry"}
              </button>
            </div>
            {!canNext && (
              <p className="hint" style={{ marginTop: 12, textAlign: "right" }}>
                {step === 0 ? "Choose at least one piece of equipment." : "Add your name and email."}
              </p>
            )}
          </>
        )}
      </form>

      <aside className="plate-wrap" aria-label="Rating plate preview">
        <p>
          Your rating plate, as it would ship to {country.name}. It changes as you fill the form.
        </p>
        <div className="plate" aria-live="polite">
          <div className="plate-head">
            <span>Supplied by GoodBiz Power Systems · Origin India</span>
            <TransformerSymbol />
          </div>
          <table>
            <tbody>
              {plateRows.map(([k, v], i) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className={changed.has(i) ? "changed" : undefined}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="plate-foot">
            For {country.name}. Pre-filled values are typical for the country; your project specification always
            takes priority.
          </p>
        </div>
      </aside>
    </div>
  );
}
