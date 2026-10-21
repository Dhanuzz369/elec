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
