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
