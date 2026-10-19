import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/data/site";

// Search and AI-assistant crawlers are welcome: being quoted by them is the point.
export const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
] as const;

export function robotsConfig(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" }))],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
