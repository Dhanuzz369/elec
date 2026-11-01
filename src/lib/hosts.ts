import { site } from "../data/site";

// Host-level rules used by next.config.ts. The site launched on Vercel's own
// address before goodbizpower.com was bought; that address must now send
// visitors and crawlers to the real domain so only one copy gets indexed.

export const OLD_HOSTS = ["goodbizelec-navy.vercel.app"];
const DOMAIN = "https://www.goodbizpower.com";

export function hostRedirects() {
  return OLD_HOSTS.map((host) => ({
    source: "/:path*",
    has: [{ type: "host" as const, value: host }],
    destination: `${DOMAIN}/:path*`,
    permanent: true,
  }));
}

// Next's bootstrap, the JSON-LD blocks and the Consent Mode defaults are inline scripts,
// and components set inline styles, so both need 'unsafe-inline'. Everything else comes
// from this site, except the lead endpoint the forms post to (and Google's redirect
// target) and Google Analytics (gtag.js and its collection endpoints).
function contentSecurityPolicy(): string {
  const lead = (() => {
    try {
      return new URL(site.leadEndpoint).origin;
    } catch {
      return "";
    }
  })();
  const leadHosts = [...new Set([lead, "https://script.google.com", "https://script.googleusercontent.com"])].filter(Boolean).join(" ");
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.google-analytics.com https://www.googletagmanager.com",
    "font-src 'self'",
    `connect-src 'self' ${leadHosts} https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`,
    `form-action 'self' ${leadHosts} mailto:`,
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

// Baseline headers search engines and browsers look for.
export function securityHeaders() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: contentSecurityPolicy() },
      ],
    },
  ];
}
