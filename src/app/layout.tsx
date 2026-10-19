import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/RevealObserver";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "GoodBiz · Electrical equipment sourced for your grid",
    template: "%s · GoodBiz",
  },
  description: "GoodBiz exports LT panels, MCC, transformers, RMUs, MV switchgear and enclosures from India, sourced to your country's voltage, standards and certificates.",
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "en", type: "website" },
  twitter: { card: "summary_large_image" },
  ...(site.googleSiteVerification && { verification: { google: site.googleSiteVerification } }),
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
