import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { mailtoHref, site, whatsappHref } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

// Describes only what the site actually does: the quote form and configurator send
// their answers to a Google Sheet and an email alert; nothing else is collected.
export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  description:
    "How GoodBiz Power Systems handles the details you send through the quote form and configurator: what we collect, why, where it is kept and how to remove it.",
  path: "/privacy",
  keywords: ["privacy policy", "quote form data", "data protection"],
});

const UPDATED = "29 October 2026";

export default function PrivacyPage() {
  return (
    <>
      <header className="article-head">
        <h1>Privacy policy</h1>
        <p className="article-meta">Last updated {UPDATED}</p>
      </header>
      <div className="article-layout">
        <div className="prose">
          <p>
            This policy explains what {site.name} does with the details you send us through this website. We keep it
            short because we collect very little.
          </p>

          <h2>What we collect</h2>
          <p>When you use the quote form or the configurator, we receive what you type or choose:</p>
          <ul>
            <li>your name, company, email address and WhatsApp or phone number;</li>
            <li>the equipment you need, its ratings and quantity, the destination country and port, delivery terms and notes;</li>
            <li>the page you sent it from, the language and your browser&apos;s user-agent string, so we can answer in context.</li>
          </ul>
          <p>
            We do not use cookies, analytics or advertising trackers. While you fill in the form, your browser keeps a request
            number and an unsent copy of your answers in its own session storage, so nothing is lost if the connection drops.
            That copy stays on your device and is cleared when you close the tab.
          </p>

          <h2>Why we use it</h2>
          <p>
            Only to answer your request: to prepare a quotation, ask follow-up questions and keep a record of what we quoted. We
            do not sell or rent your details, and we do not add you to a mailing list.
          </p>

          <h2>Where it is kept</h2>
          <p>
            Your answers are saved to a Google Sheet in our company Google Workspace account, and an alert with the same details is
            emailed to our sales inbox. Only our team can open them. The website is hosted by Vercel, which keeps standard server
            logs such as IP addresses for security.
          </p>
          <p>
            If you contact us by WhatsApp or email instead, those messages are handled under WhatsApp&apos;s and your email
            provider&apos;s own terms as well as this policy.
          </p>

          <h2>How long we keep it</h2>
          <p>
            For as long as we need it to quote, supply and support your order, and to meet our record-keeping duties for exports.
            You can ask us to delete it at any time.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask to see, correct or delete the details we hold about you, in line with India&apos;s Digital Personal Data
            Protection Act, 2023. Write to{" "}
            <a href={mailtoHref()} className="link" title={`Email ${site.name}`}>
              {site.email}
            </a>{" "}
            or message us on{" "}
            <a href={whatsappHref()} className="link" title={`WhatsApp ${site.name}`}>
              WhatsApp {site.phone}
            </a>
            , and we will reply within a few working days.
          </p>

          <h2>Changes</h2>
          <p>
            If we change how we handle your details, we will update this page and the date above. To ask for a quote, go to{" "}
            <Link href="/quote" className="link" title="Get a quote for electrical equipment">
              the quote form
            </Link>
            .
          </p>
        </div>
      </div>
      <div style={{ height: "var(--section)" }} />
      <JsonLd
        data={[webPageLd({ path: "/privacy", name: "Privacy policy" }), breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy policy", path: "/privacy" },
        ])]}
      />
    </>
  );
}
