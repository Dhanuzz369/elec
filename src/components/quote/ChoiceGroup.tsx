import Image from "next/image";
import type { ReactNode } from "react";
import type { Choice } from "@/lib/quote/options";

type Props = {
  name: string;
  labelledBy: string;
  choices: Choice[];
  value: string;
  kind: "card" | "pill" | "term";
  error?: string;
  // Called with true when the pick came from a tap or click (which may move on), false for keys.
  onPick: (id: string, byPointer: boolean) => void;
  onPointer: () => void;
  // The text box that opens under the "Something else" / "Another amount" choice.
  other?: ReactNode;
};

// A breaker has no product photograph yet, so its card gets a drawn symbol.
function BreakerGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M24 6v12M24 30v12M24 18l9 10" />
      <circle cx="24" cy="18" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="24" cy="30" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChoiceGroup({ name, labelledBy, choices, value, kind, error, onPick, onPointer, other }: Props) {
  const errorId = `qf-${name}-error`;
  return (
    <div
      className={`qf-choices qf-choices--${kind}`}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      {choices.map((c) => {
        const wide = kind === "card" && !c.image && c.id === "other";
        return (
          <label key={c.id} className={`qf-choice${wide ? " qf-choice--wide" : ""}`} onPointerDown={onPointer}>
            <input
              type="radio"
              name={name}
              value={c.id}
              checked={value === c.id}
              onChange={() => onPick(c.id, false)}
              onClick={() => onPick(c.id, true)}
            />
            {kind === "card" && !wide && (
              <span className="qf-photo">
                {c.image ? <Image src={c.image} alt="" fill sizes="(max-width: 640px) 30vw, 180px" /> : <BreakerGlyph />}
              </span>
            )}
            <span className="qf-choice-label">{c.label}</span>
            {c.hint && <span className="qf-choice-hint">{c.hint}</span>}
          </label>
        );
      })}
      {other}
      <p className="qf-error" id={errorId} role="alert">
        {error}
      </p>
    </div>
  );
}
