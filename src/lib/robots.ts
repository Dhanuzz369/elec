import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/data/site";

// Search and AI-assistant crawlers are welcome: being quoted by them is the point.
export const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
] as const;

export function robotsConfig(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" }))],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

// Only standard directives: draft ones such as Content-Signal fail Lighthouse's
// robots.txt check and are ignored by Google, so they would cost more than they say.
export function robotsTxt(): string {
  const groups = [`User-agent: *\nAllow: /`, ...AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /`)];
  return `${groups.join("\n\n")}\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`;
}
