// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver, Yep) that every URL in the
// live sitemap is new or changed. Run after a deploy: `npm run indexnow`.
// The key is the name of the .txt file in /public that contains the same string.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const HOST = "www.goodbizpower.com";
const keyFile = readdirSync(path.join(process.cwd(), "public")).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (32 hex characters + .txt) in public/");
const key = readFileSync(path.join(process.cwd(), "public", keyFile), "utf8").trim();

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("The live sitemap lists no URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (!res.ok && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
