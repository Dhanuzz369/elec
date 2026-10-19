import type { Faq } from "@/lib/posts";

// Native <details> answers: readable without JS, and the same text as the FAQPage data.
export function FaqList({ faq, title = "Questions buyers ask", id }: { faq: Faq[]; title?: string; id?: string }) {
  if (!faq.length) return null;
  const headingId = `${id ?? "faq"}-title`;
  return (
    <section className="faq" id={id} aria-labelledby={headingId}>
      <h2 id={headingId} data-reveal>
        {title}
      </h2>
      <div className="faq-list" data-stagger>
        {faq.map((f, i) => (
          <details key={f.q} data-reveal open={i === 0}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
