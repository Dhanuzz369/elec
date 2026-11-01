"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY, GA_ID, needsConsentPrompt, setAnalyticsConsent, track } from "@/lib/analytics";

const CONTACTS: [RegExp, string][] = [
  [/^https:\/\/wa\.me\//, "whatsapp"],
  [/^mailto:/, "email"],
  [/^tel:/, "phone"],
];

// gtag.js is ~180 KB and ~400 ms of script, so it loads on the visitor's first scroll,
// tap, click or key press, or after 12 seconds, never while the page is loading. Events
// raised before then wait in dataLayer and are sent when it arrives.
const LOAD_AFTER_MS = 12000;
const FIRST_INTERACTION = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

// Records WhatsApp, email and phone clicks site-wide, and asks for consent where the
// law requires it.
export function Analytics() {
  const [ask, setAsk] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const start = () => setLoad(true);
    const timer = window.setTimeout(start, LOAD_AFTER_MS);
    for (const ev of FIRST_INTERACTION) window.addEventListener(ev, start, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      for (const ev of FIRST_INTERACTION) window.removeEventListener(ev, start);
    };
  }, []);

  useEffect(() => {
    if (!GA_ID) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {
      // Storage blocked: ask again next time.
    }
    setAsk(needsConsentPrompt(Intl.DateTimeFormat().resolvedOptions().timeZone, stored));

    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element | null)?.closest?.("a")?.getAttribute("href") ?? "";
      const method = CONTACTS.find(([re]) => re.test(href))?.[1];
      if (method) track("contact_click", { method, link_location: window.location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!GA_ID) return null;

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setAsk(false);
  };

  return (
    <>
      {load && <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />}
      {ask && (
        <div className="consent" role="region" aria-label="Cookie choice">
          <p>
            We use Google Analytics cookies to see which pages buyers find useful. No advertising and no personal
            details.{" "}
            <Link href="/privacy" className="link" title="Privacy policy">
              Privacy policy
            </Link>
          </p>
          <div className="consent-actions">
            <button type="button" className="btn" onClick={() => choose(true)}>
              Accept
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => choose(false)}>
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
