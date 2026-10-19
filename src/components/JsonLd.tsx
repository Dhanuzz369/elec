import { createElement } from "react";

type Node = Record<string, unknown>;

// Renders schema.org data as one <script type="application/ld+json">.
// "<" is escaped so text inside the data can never close the script tag.
export function JsonLd({ data }: { data: Node | (Node | null)[] }) {
  const nodes = Array.isArray(data) ? data.filter((n): n is Node => n !== null) : [data];
  if (!nodes.length) return null;
  const doc =
    nodes.length === 1 && !Array.isArray(data)
      ? { "@context": "https://schema.org", ...nodes[0] }
      : { "@context": "https://schema.org", "@graph": nodes };
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(doc).replace(/</g, "\\u003c") },
  });
}
