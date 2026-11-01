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

// Loads gtag.js after the page is interactive, records WhatsApp, email and phone
// clicks site-wide, and asks for consent where the law requires it.
export function Analytics() {
  const [ask, setAsk] = useState(false);

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
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
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
