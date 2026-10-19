import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/RevealObserver";

export const metadata: Metadata = {
  title: {
    default: "GoodBiz · Electrical equipment sourced for your grid",
    template: "%s · GoodBiz",
  },
  description:
    "Indian exporter of LT panels, MCC, transformers, RMUs, MV switchgear, breakers and enclosures, built to the voltage, standard and certification of the destination country.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
