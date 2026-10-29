import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ProjectTypes } from "@/components/about/ProjectTypes";
import { whatsappHref } from "@/data/site";
import { breadcrumbLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "About us",
  description:
    "GoodBiz Power Systems: 25+ years as a licensed EPC contractor for BESCOM, public discoms and KPTCL. One-stop supply, RMU to enclosure, for projects worldwide.",
  path: "/about",
});

const FACTS = [
  ["25+", "years in power distribution"],
  ["Licensed EPC", "for BESCOM and public discoms"],
  ["KPTCL", "transmission projects"],
  ["One stop", "RMU to enclosure, one order"],
];

const RANGE: [string, string][] = [
  ["RMUs and MV switchgear", "mv-switchgear-rmu"],
  ["Transformers", "transformers"],
  ["LT panels (PCC, MCC)", "lt-panels"],
  ["Automation and PLC panels", "lt-panels"],
  ["APFC and ATS panels", "lt-panels"],
  ["Breakers and contactors", "breakers-contactors"],
  ["Enclosures and junction boxes", "enclosures-junction-boxes"],
  ["Busbars and parts", "parts"],
];

const STEPS = [
  ["Understand", "Your site, load, standards and budget."],
  ["Recommend", "The right products and brands, and why."],
  ["Source", "From partner manufacturers, built to your specification."],
  ["Inspect and test", "Every order is tested before it ships."],
  ["Document", "Drawings, test reports and export paperwork."],
  ["Ship", "One consolidated shipment to your port or site."],
];

export default function AboutPage() {
  return (
    <>
      <section className="ap-hero" aria-labelledby="ap-title">
        <div data-stagger>
          <p className="ap-eyebrow" data-reveal>
            About GoodBiz Power Systems
          </p>
          <h1 id="ap-title" data-reveal>
            25 years building India&apos;s power network. Now we supply yours.
          </h1>
          <p className="ap-lead" data-reveal>
            For more than 25 years, GoodBiz Power Systems and its group companies have worked as licensed EPC
            contractors for BESCOM and other public distribution companies, and on projects for KPTCL, Karnataka&apos;s
            transmission utility. That work taught us which panel, which switchgear and which brand holds up on a real
            site, inspected to a utility&apos;s standard.
          </p>
          <p className="ap-lead" data-reveal>
            We bring that judgment to buyers worldwide: one partner for everything from the RMU to the last enclosure.
          </p>
        </div>
        <dl className="ap-facts" data-stagger>
          {FACTS.map(([dt, dd]) => (
            <div key={dt} data-reveal>
              <dt>{dt}</dt>
              <dd>{dd}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ap-story" aria-labelledby="ap-story-title" data-stagger>
        <h2 id="ap-story-title" data-reveal>
          Utility work is the hardest school there is
        </h2>
        <div data-reveal>
          <p>
            A distribution company doesn&apos;t accept close enough. Every RMU, transformer and panel we installed for
            BESCOM and the other discoms had to meet their specification, pass their inspection and keep running for
            decades. Across apartment complexes, commercial buildings, IT parks and industrial plants, we learned what
            fails in the field, which brands hold their ratings, and how to put a whole installation together so it
            works on day one.
          </p>
          <p>Buyers abroad now get the same judgment. We tell you what to buy and why, then supply all of it.</p>
        </div>
      </section>

      <section className="ap-projects" aria-labelledby="ap-projects-title" data-testid="project-types">
        <div data-stagger>
          <p className="ap-eyebrow" data-reveal>
            Right product for your project
          </p>
          <h2 id="ap-projects-title" data-reveal>
            Every project needs different power.
          </h2>
          <p className="ap-lead" data-reveal>
            An apartment block, an IT park and a steel plant don&apos;t need the same panels, the same transformer or the
            same brand. After 25 years on BESCOM and KPTCL sites, we know what each one needs, and we&apos;ll put it
            together for yours.
          </p>
        </div>
        <ProjectTypes />
      </section>

      <section className="ap-range" aria-labelledby="ap-range-title" data-stagger>
        <h2 id="ap-range-title" data-reveal>
          Everything your installation needs, from one partner
        </h2>
        <div data-reveal>
          <ul className="ap-range-list">
            {RANGE.map(([name, slug]) => (
              <li key={name}>
                <Link href={`/products/${slug}`} className="link">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            We don&apos;t manufacture, and that&apos;s deliberate. We aren&apos;t tied to one factory, so we recommend the
            brand and build that suit your project, from manufacturers whose products we&apos;ve installed on utility and
            private projects.
          </p>
        </div>
      </section>

      <section className="ap-how" aria-labelledby="ap-how-title">
        <h2 id="ap-how-title" data-reveal>
          Tailored, not off the shelf
        </h2>
        <ol className="ap-steps" data-stagger>
          {STEPS.map(([title, text], i) => (
            <li key={title} data-reveal>
              <span className="ap-step-n num">0{i + 1}</span>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="ap-end" aria-labelledby="ap-end-title" data-stagger>
        <h2 id="ap-end-title" data-reveal>
          Tell us about your project
        </h2>
        <p data-reveal>We&apos;ll recommend the right products and send you a quote.</p>
        <div className="ap-end-actions" data-reveal>
          <Link href="/quote" className="btn">
            Get a quote
          </Link>
          <a href={whatsappHref()} className="btn btn--quiet">
            WhatsApp us
          </a>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About us", path: "/about" },
        ])}
      />
    </>
  );
}
