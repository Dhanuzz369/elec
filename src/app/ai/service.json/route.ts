import { aiService } from "@/lib/ai-files";

export const dynamic = "force-static";

export function GET() {
  return Response.json(aiService());
}
