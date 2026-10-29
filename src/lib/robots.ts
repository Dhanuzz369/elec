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

// Content signals (contentsignals.org): search, AI answers and training are all allowed.
const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

export function robotsConfig(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" }))],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

// Written by hand because Next's robots metadata has no field for Content-Signal.
export function robotsTxt(): string {
  const groups = [`User-agent: *\nContent-Signal: ${CONTENT_SIGNAL}\nAllow: /`, ...AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /`)];
  return `${groups.join("\n\n")}\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`;
}
