import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/data/site";
import { HOME_TITLE } from "@/lib/meta";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/RevealObserver";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/jsonld";

// General Sans (Fontshare, ITF Free Font License), self-hosted so no third-party
// stylesheet blocks the first paint; next/font preloads it and adds a size-matched fallback.
const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-general-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: HOME_TITLE,
    template: "%s · GoodBiz Power Systems",
  },
  description: "GoodBiz Power Systems exports LT panels, transformers, RMUs, MV switchgear and enclosures from India, matched to your country's grid and certificates.",
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Electrical equipment",
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    ICBM: "12.9716, 77.5946",
  },
  openGraph: { siteName: site.name, locale: "en", type: "website" },
  twitter: { card: "summary_large_image" },
  verification: {
    ...(site.googleSiteVerification && { google: site.googleSiteVerification }),
    ...(site.bingSiteVerification && { other: { "msvalidate.01": site.bingSiteVerification } }),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={generalSans.variable}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <RevealObserver />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
