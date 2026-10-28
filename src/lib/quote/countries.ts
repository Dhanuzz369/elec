import { countries } from "@/data/countries";

// ISO 3166-1 alpha-2 codes. Names come from Intl.DisplayNames in the page's
// language, so adding a language needs no country list of its own.
const ISO_CODES =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );

const cache = new Map<string, string[]>();

export function countryNames(lang: string): string[] {
  const hit = cache.get(lang);
  if (hit) return hit;
  const display = new Intl.DisplayNames([lang, "en"], { type: "region" });
  const name = (code: string) => {
    try {
      const n = display.of(code);
      return n && n !== code ? n : "";
    } catch {
      return "";
    }
  };
  const first = countries.map((c) => name(c.code)).filter(Boolean);
  const firstSet = new Set(first);
  const rest = ISO_CODES.map(name)
    .filter((n) => n && !firstSet.has(n))
    .sort((a, b) => a.localeCompare(b, lang));
  const list = [...new Set([...first, ...rest])];
  cache.set(lang, list);
  return list;
}

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();

export function suggestCountries(query: string, names: string[], limit = 6): string[] {
  const q = fold(query);
  if (!q) return [];
  const starts: string[] = [];
  const contains: string[] = [];
  for (const n of names) {
    const f = fold(n);
    if (f.startsWith(q)) starts.push(n);
    else if (f.includes(q)) contains.push(n);
  }
  return [...starts, ...contains].slice(0, limit);
}
