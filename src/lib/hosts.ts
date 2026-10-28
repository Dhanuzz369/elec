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

// Baseline headers search engines and browsers look for. No CSP yet: the site
// loads its font from Fontshare and inline JSON-LD, which a policy must allow first.
export function securityHeaders() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ];
}
