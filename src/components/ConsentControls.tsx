"use client";

import { useEffect, useState } from "react";
import { CONSENT_KEY, setAnalyticsConsent } from "@/lib/analytics";

// Lets any visitor change their analytics choice at any time from the privacy page.
export function ConsentControls() {
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    try {
      setChoice(localStorage.getItem(CONSENT_KEY));
    } catch {
      // Storage blocked: show the buttons without a current state.
    }
  }, []);

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setChoice(granted ? "granted" : "denied");
  };

  return (
    <div className="consent-controls" role="group" aria-label="Analytics cookies">
      <p aria-live="polite">
        Analytics cookies on this browser:{" "}
        <strong>{choice === "granted" ? "allowed" : choice === "denied" ? "declined" : "not chosen yet"}</strong>
      </p>
      <div className="consent-actions">
        <button type="button" className="btn" onClick={() => choose(true)}>
          Allow analytics
        </button>
        <button type="button" className="btn btn--quiet" onClick={() => choose(false)}>
          Decline analytics
        </button>
      </div>
    </div>
  );
}
