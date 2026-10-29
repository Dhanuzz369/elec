import { hostRedirects, securityHeaders } from "@/lib/hosts";

test("the old vercel.app address redirects permanently to the real domain", () => {
  const [rule] = hostRedirects();
  expect(rule.has).toEqual([{ type: "host", value: "goodbizelec-navy.vercel.app" }]);
  expect(rule.destination).toBe("https://www.goodbizpower.com/:path*");
  expect(rule.permanent).toBe(true);
});

test("every page gets the basic security headers", () => {
  const [rule] = securityHeaders();
  const names = rule.headers.map((h) => h.key);
  expect(rule.source).toBe("/:path*");
  for (const n of ["X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options", "Permissions-Policy"]) expect(names).toContain(n);
});

test("a content security policy allows only this site and the lead endpoint", () => {
  const headers = securityHeaders()[0].headers;
  const csp = headers.find((h) => h.key === "Content-Security-Policy")?.value ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toMatch(/connect-src 'self' [^;]*https:\/\/script\.google\.com/);
  expect(csp).toMatch(/form-action 'self' [^;]*https:\/\/script\.google\.com/);
  expect(csp).not.toMatch(/fontshare/);
});
