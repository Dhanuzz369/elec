import Link from "next/link";
import { whatsappHref } from "@/data/site";
import { Bullet } from "./Motif";

type Props = {
  title: string;
  text: string;
  href: string;
  action: string;
  steps?: string[];
  secondary?: { href: string; label: string };
};

const DEFAULT_STEPS = [
  "Choose the equipment and ratings you need",
  "Pick the destination country; we fill in its grid and certificate",
  "Get a quotation with the HSN code for every line",
];

// The closing call to action: what to do, what happens next, and one clear button.
export function QuoteCta({ title, text, href, action, steps = DEFAULT_STEPS, secondary }: Props) {
  return (
    <section className="quote-cta" aria-labelledby="quote-cta-title">
      <div className="quote-cta-copy" data-stagger>
        <h2 id="quote-cta-title" data-reveal>
          {title}
        </h2>
        <p data-reveal>{text}</p>
      </div>
      <ol className="quote-cta-steps" data-stagger>
        {steps.map((s) => (
          <li key={s} data-reveal>
            <Bullet />
            {s}
          </li>
        ))}
      </ol>
      <div className="quote-cta-actions" data-reveal>
        <Link href={href} className="btn btn--large">
          {action}
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </Link>
        {secondary && (
          <Link href={secondary.href} className="btn btn--quiet">
            {secondary.label}
          </Link>
        )}
        <a href={whatsappHref()} className="btn btn--quiet">
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}
