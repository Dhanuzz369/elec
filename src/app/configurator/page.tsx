import type { Metadata } from "next";
import { Suspense } from "react";
import { Configurator } from "@/components/Configurator";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Configure your requirement",
  description:
    "Tell GoodBiz Power Systems your project, country and ratings. We pre-fill your grid voltage, frequency, standards and certificates, then source to match.",
  path: "/configurator",
  keywords: [
    "electrical panel configurator",
    "transformer specification",
    "grid voltage and frequency by country",
    "electrical standards by country",
    "certificate requirements electrical equipment",
    "configure LT panel",
    "electrical requirement form",
  ],
});

export default function ConfiguratorPage() {
  return (
    <>
      <Suspense>
        <Configurator />
      </Suspense>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Configure your requirement", path: "/configurator" },
        ])}
      />
    </>
  );
}
