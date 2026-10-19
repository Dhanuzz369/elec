import type { Metadata } from "next";
import { Suspense } from "react";
import { Configurator } from "@/components/Configurator";

export const metadata: Metadata = {
  title: "Configure your requirement",
  description:
    "Tell GoodBiz your project, destination country and ratings. We pre-fill the grid voltage, frequency, standards and certification for your country and build to match.",
};

export default function ConfiguratorPage() {
  return (
    <Suspense>
      <Configurator />
    </Suspense>
  );
}
