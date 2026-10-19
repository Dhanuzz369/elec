import type { Metadata } from "next";
import { Suspense } from "react";
import { Configurator } from "@/components/Configurator";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Configure your requirement",
  description:
    "Tell GoodBiz your project, country and ratings. We pre-fill the grid voltage, frequency, standards and certificates for your country and source to match.",
  path: "/configurator",
});

export default function ConfiguratorPage() {
  return (
    <Suspense>
      <Configurator />
    </Suspense>
  );
}
