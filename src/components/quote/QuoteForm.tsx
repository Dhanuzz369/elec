"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFamily } from "@/data/products";
import { mailtoHref, site } from "@/data/site";
import { countryNames, suggestCountries } from "@/lib/quote/countries";
import { OTHER, QUANTITY_CHOICES, TERMS_CHOICES, productChoices, varietyChoices } from "@/lib/quote/options";
import { buildPayload, fallbackLinks, type Stage } from "@/lib/quote/payload";
import { parsePrefill } from "@/lib/quote/prefill";
import { getLeadId, resendPending, sendLead } from "@/lib/quote/send";
import { clearDependents, emptyAnswers, validateStep, visibleSteps, type Answers, type Prefill, type StepId } from "@/lib/quote/steps";
import { fill, getStrings } from "@/lib/quote/strings";
import { ChoiceGroup } from "./ChoiceGroup";

const ADVANCE_MS = 260;
const MIN_FILL_MS = 3000;

type Status = "form" | "sending" | "success" | "fallback";
type Errors = Partial<Record<keyof Answers, string>>;

// "Transformers" reads as "transformers" mid-sentence; "LT panels" and "MV switchgear" keep their capitals.
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

function session(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

// One question per screen, mostly taps. Contact comes first and is saved the
// moment the visitor taps Next; every later step updates the same sheet row.
// The server renders every step as one plain form, so it also works without JavaScript.
export function QuoteForm() {
  const [lang, setLang] = useState("en");
  const t = getStrings(lang);
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [prefill, setPrefill] = useState<Prefill>({});
  const [step, setStep] = useState<StepId>("contact");
  // Null until the visitor first moves, so the opening step does not slide in on page load.
  const [dir, setDir] = useState<"forward" | "back" | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("form");
  const [query, setQuery] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  // The name last picked from the list; the list closes while the field still shows it.
  const [picked, setPicked] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const leadId = useRef("");
  const mountedAt = useRef(0);
  const sending = useRef(false);
  const byPointer = useRef(false);
  const advanceTimer = useRef<number | undefined>(undefined);
  const firstStep = useRef(true);

  useEffect(() => {
    const html = document.documentElement;
    setLang(html.lang || "en");
    mountedAt.current = Date.now();
    leadId.current = getLeadId(session());
    const p = parsePrefill(new URLSearchParams(window.location.search));
    setPrefill(p);
    setAnswers((a) => ({ ...a, product: p.product ?? a.product, variety: p.variety ?? a.variety }));
    setReady(true);
    void resendPending({ endpoint: site.leadEndpoint, storage: session() });
    return () => window.clearTimeout(advanceTimer.current);
  }, []);

  const steps = visibleSteps(answers, prefill);
  const index = Math.max(steps.indexOf(step), 0);
  const names = useMemo(() => countryNames(lang), [lang]);
  const suggestions = query === picked ? [] : suggestCountries(query, names);
  const family = getFamily(answers.product);

  // Bring the new step into view under the sticky header, but only when it is out of sight.
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const form = formRef.current;
    if (!form) return;
    const header = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 72;
    const top = form.getBoundingClientRect().top;
    if (top < header + 8 || top > window.innerHeight - 160) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + top - header - 16, behavior: reduced ? "auto" : "smooth" });
    }
    // Typing steps get the cursor in their first field; tapping steps get their heading read out.
    const section = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const field = section?.querySelector<HTMLElement>('[role="radiogroup"]')
      ? null
      : section?.querySelector<HTMLElement>("input:not([type=checkbox]), textarea");
    (field ?? section?.querySelector<HTMLElement>("h2"))?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function payload(a: Answers, stage: Stage) {
    return buildPayload(a, {
      leadId: leadId.current,
      stage,
      prefill,
      page: window.location.pathname + window.location.search,
      lang,
      userAgent: navigator.userAgent,
    });
  }

  function update(field: keyof Answers, value: string | boolean) {
    setAnswers((a) => clearDependents({ ...a, [field]: value }, field));
    if (errors[field]) setErrors({});
  }

  function showError(field: keyof Answers, message: string) {
    setErrors({ [field]: message });
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`#qf-${field}, [name="${field}"]:checked, [name="${field}"]`);
      el?.focus();
    });
  }

  function goNext(a: Answers) {
    window.clearTimeout(advanceTimer.current);
    const err = validateStep(step, a, t);
    if (err) return showError(err.field, err.message);
    setErrors({});
    if (step === "notes") return void submit(a);
    void sendLead(payload(a, step), { endpoint: site.leadEndpoint, final: false, storage: session() });
    const list = visibleSteps(a, prefill);
    setDir("forward");
    setStep(list[list.indexOf(step) + 1] ?? "notes");
  }

  function goBack() {
    window.clearTimeout(advanceTimer.current);
    setErrors({});
    setDir("back");
    setStep(steps[index - 1] ?? steps[0]);
    if (status === "fallback") setStatus("form");
  }

  async function submit(a: Answers) {
    if (sending.current) return;
    sending.current = true;
    setStatus("sending");
    if (a.website) {
      setStatus("success");
      return;
    }
    // A quick, real visitor is held back to the three-second minimum, never dropped.
    const wait = MIN_FILL_MS - (Date.now() - mountedAt.current);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    const ok = await sendLead(payload(a, "submitted"), { endpoint: site.leadEndpoint, final: true, storage: session() });
    if (ok) {
      setStatus("success");
      return;
    }
    sending.current = false;
    setStatus("fallback");
  }

  // Taps and clicks move on after a short beat; arrow keys only change the choice.
  function pick(field: keyof Answers, id: string, viaPointer: boolean) {
    const fromPointer = viaPointer && byPointer.current;
    const next = clearDependents({ ...answers, [field]: id }, field);
    if (!viaPointer || next[field] !== answers[field]) update(field, id);
    if (!fromPointer) return;
    byPointer.current = false;
    window.clearTimeout(advanceTimer.current);
    if (id === OTHER) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#qf-${field}Other`)?.focus());
      return;
    }
    advanceTimer.current = window.setTimeout(() => goNext(next), ADVANCE_MS);
  }

  function chooseCountry(name: string) {
    update("country", name);
    setQuery(name);
    setPicked(name);
    setActiveSuggestion(-1);
  }

  function onCountryKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActiveSuggestion((i) => (i + step + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      chooseCountry(suggestions[activeSuggestion]);
    } else if (e.key === "Escape") {
      setPicked(query);
    }
  }

  const stepProps = (id: StepId) => ({
    "data-step": id,
    "data-active": step === id ? "" : undefined,
    hidden: ready && step !== id ? true : undefined,
    className: "qf-step",
  });
  const title = (id: StepId, text: string) => (
    <h2 id={`qf-title-${id}`} tabIndex={-1}>
      {text}
    </h2>
  );
  const err = (field: keyof Answers) => (
    <p className="qf-error" id={`qf-${field}-error`} role="alert">
      {errors[field]}
    </p>
  );
  const text = (field: keyof Answers, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="qf-field">
      <label htmlFor={`qf-${field}`}>{label}</label>
      <input
        id={`qf-${field}`}
        name={field}
        value={answers[field] as string}
        onChange={(e) => update(field, e.target.value)}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={errors[field] ? `qf-${field}-error` : undefined}
        {...props}
      />
      {err(field)}
    </div>
  );
  const pointer = () => {
    byPointer.current = true;
  };

  if (status === "success") {
    return (
      <div className="qf qf-done" data-testid="quote-done">
        <svg className="qf-check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27l7 7 15-16" />
        </svg>
        <h2 ref={successRef} tabIndex={-1} data-testid="quote-success">
          {t.success.title}
        </h2>
        <p>{t.success.text}</p>
        <Link href="/products" className="btn btn--quiet" title={t.success.link}>
          {t.success.link}
        </Link>
      </div>
    );
  }

  const links = status === "fallback" ? fallbackLinks(payload(answers, "submitted")) : null;
  const endpoint = site.leadEndpoint;

  return (
    <form
      ref={formRef}
      className="qf"
      data-testid="quote-form"
      data-ready={ready ? "" : undefined}
      data-dir={dir ?? undefined}
      method="post"
      action={endpoint || mailtoHref("Quote request")}
      encType={endpoint ? undefined : "text/plain"}
      noValidate={ready}
      onSubmit={(e) => {
        e.preventDefault();
        goNext(answers);
      }}
      onKeyDown={() => {
        byPointer.current = false;
      }}
    >
      <div className="qf-progress" aria-hidden={!ready}>
        <span data-testid="quote-progress">{fill(t.progress, { n: index + 1, m: steps.length })}</span>
        <span className="qf-bar">
          <i style={{ transform: `scaleX(${(index + 1) / steps.length})` }} />
        </span>
      </div>

      <section {...stepProps("contact")}>
        {title("contact", t.steps.contact)}
        {text("name", t.fields.name, { autoComplete: "name", required: true })}
        {text("company", t.fields.company, { autoComplete: "organization" })}
        {text("email", t.fields.email, { type: "email", autoComplete: "email", inputMode: "email" })}
        {text("phone", t.fields.phone, { type: "tel", autoComplete: "tel", inputMode: "tel" })}
        <p className="qf-hint">{t.hints.contact}</p>
        <p className="qf-privacy">{t.hints.privacy}</p>
        <div className="qf-hp" aria-hidden="true">
          <label>
            {t.fields.honeypot}
            <input
              type="checkbox"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              checked={answers.website}
              onChange={(e) => update("website", e.target.checked)}
            />
          </label>
        </div>
      </section>

      <section {...stepProps("product")}>
        {title("product", t.steps.product)}
        <ChoiceGroup
          name="product"
          labelledBy="qf-title-product"
          kind="card"
          choices={productChoices().map((c) => (c.id === OTHER ? { ...c, label: t.choices.other } : c))}
          value={answers.product}
          error={errors.product}
          onPointer={pointer}
          onPick={(id, p) => pick("product", id, p)}
          other={
            <div className="qf-other qf-field">
              <label htmlFor="qf-productOther">{t.fields.productOther}</label>
              <input
                id="qf-productOther"
                name="productOther"
                placeholder={t.fields.productOtherPlaceholder}
                value={answers.productOther}
                onChange={(e) => update("productOther", e.target.value)}
                aria-invalid={errors.productOther ? true : undefined}
                aria-describedby={errors.productOther ? "qf-productOther-error" : undefined}
              />
              {err("productOther")}
            </div>
          }
        />
      </section>

      {/* Varieties depend on the product, so this step exists only once one is chosen. */}
      {family && (
        <section {...stepProps("variety")}>
          {title("variety", fill(t.steps.variety, { family: lowerFirst(family.name) }))}
          <ChoiceGroup
            name="variety"
            labelledBy="qf-title-variety"
            kind="pill"
            choices={varietyChoices(family.slug).map((c) => (c.id === "any" ? { ...c, label: t.choices.any } : c))}
            value={answers.variety}
            error={errors.variety}
            onPointer={pointer}
            onPick={(id, p) => pick("variety", id, p)}
          />
        </section>
      )}

      <section {...stepProps("quantity")}>
        {title("quantity", t.steps.quantity)}
        <ChoiceGroup
          name="quantity"
          labelledBy="qf-title-quantity"
          kind="pill"
          choices={QUANTITY_CHOICES}
          value={answers.quantity}
          error={errors.quantity}
          onPointer={pointer}
          onPick={(id, p) => pick("quantity", id, p)}
          other={
            <div className="qf-other qf-field">
              <label htmlFor="qf-quantityOther">{t.fields.quantityOther}</label>
              <input
                id="qf-quantityOther"
                name="quantityOther"
                placeholder={t.fields.quantityOtherPlaceholder}
                value={answers.quantityOther}
                onChange={(e) => update("quantityOther", e.target.value)}
                aria-invalid={errors.quantityOther ? true : undefined}
                aria-describedby={errors.quantityOther ? "qf-quantityOther-error" : undefined}
              />
              {err("quantityOther")}
            </div>
          }
        />
      </section>

      <section {...stepProps("destination")}>
        {title("destination", t.steps.destination)}
        <div className="qf-field qf-combo">
          <label htmlFor="qf-country">{t.fields.country}</label>
          <input
            id="qf-country"
            name="country"
            role="combobox"
            autoComplete="country-name"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="qf-country-list"
            aria-activedescendant={activeSuggestion >= 0 ? `qf-country-${activeSuggestion}` : undefined}
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={errors.country ? "qf-country-error" : undefined}
            placeholder={t.fields.countryPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              update("country", e.target.value);
              setActiveSuggestion(-1);
            }}
            onKeyDown={onCountryKey}
          />
          <ul id="qf-country-list" role="listbox" className="qf-suggest" hidden={!suggestions.length}>
            {suggestions.map((name, i) => (
              <li
                key={name}
                id={`qf-country-${i}`}
                role="option"
                aria-selected={i === activeSuggestion}
                onPointerDown={(e) => {
                  e.preventDefault();
                  chooseCountry(name);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
          {err("country")}
        </div>
        {text("port", t.fields.port, { autoComplete: "off" })}
      </section>

      <section {...stepProps("terms")}>
        {title("terms", t.steps.terms)}
        <ChoiceGroup
          name="terms"
          labelledBy="qf-title-terms"
          kind="term"
          choices={TERMS_CHOICES}
          value={answers.terms}
          error={errors.terms}
          onPointer={pointer}
          onPick={(id, p) => pick("terms", id, p)}
        />
      </section>

      <section {...stepProps("notes")}>
        {title("notes", t.steps.notes)}
        <div className="qf-field">
          <label htmlFor="qf-notes">{t.fields.notes}</label>
          <textarea
            id="qf-notes"
            name="notes"
            rows={4}
            placeholder={t.fields.notesPlaceholder}
            value={answers.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>
        {links && (
          <div className="qf-fallback" role="alert">
            <strong>{t.fallback.title}</strong>
            <p>{t.fallback.text}</p>
            <div className="qf-fallback-actions">
              <a className="btn" href={links.whatsapp} title={t.fallback.whatsapp} data-testid="fallback-whatsapp" target="_blank" rel="noopener">
                {t.fallback.whatsapp}
              </a>
              <a className="btn btn--quiet" href={links.email} title={t.fallback.email} data-testid="fallback-email">
                {t.fallback.email}
              </a>
            </div>
          </div>
        )}
      </section>

      <div className="qf-nav">
        {index > 0 && (
          <button type="button" className="btn btn--quiet qf-back" onClick={goBack}>
            {t.back}
          </button>
        )}
        <button type="submit" className="btn qf-next" disabled={status === "sending"} data-testid="quote-next">
          <span className="qf-js">{step === "notes" ? (status === "sending" ? t.sending : t.send) : t.next}</span>
          <span className="qf-nojs">{t.noJsSubmit}</span>
        </button>
      </div>
    </form>
  );
}
