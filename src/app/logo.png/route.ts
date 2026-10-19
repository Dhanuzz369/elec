import { renderMark } from "@/lib/og";

// Stable 512px logo URL for structured data (Organization.logo).
export const dynamic = "force-static";

export function GET() {
  return renderMark(512);
}
