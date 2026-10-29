import { NextResponse, type NextRequest } from "next/server";

// Agents that ask for text/markdown get the Markdown version of the page (src/app/md).
// The matcher only fires for those requests, so browsers never run this code.
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = `/md${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    {
      source: "/((?!_next|md|api|.*\\.).*)",
      has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
    },
  ],
};
