// The four kinds of project on the About page, with what each typically needs.
// Building photos are CC0 (recorded in assets/credits.json) and never shown as our own projects;
// product photos are the site's own.

export type ProjectNeed = { name: string; image?: string; href?: string };

export type ProjectType = {
  id: "apartments" | "commercial" | "it-parks" | "industries";
  name: string;
  question: string;
  summary: string;
  photo: { src: string; width: number; height: number; alt: string };
  needs: ProjectNeed[];
  watch: string[];
};

const product = (file: string) => `/images/products/${file}.webp`;
const family = (slug: string) => `/products/${slug}`;

export const projectTypes: ProjectType[] = [
  {
    id: "apartments",
    name: "Residential apartments",
    question: "What electrical equipment does a residential apartment project need?",
    summary: "Hundreds of homes on one supply: safe, metered and quiet.",
    photo: { src: "/images/projects/apartments.webp", width: 1600, height: 1067, alt: "A modern high-rise apartment building" },
    needs: [
      { name: "RMU or compact substation", image: product("enc-outdoor-grp-kiosk"), href: family("mv-switchgear-rmu") },
      { name: "Distribution transformer", image: product("transformer-oil-onan"), href: family("transformers") },
      { name: "Metering cabinet", image: product("enclosure-metering-cabinet"), href: family("enclosures-junction-boxes") },
      { name: "Generator changeover (ATS)", image: product("lt-ats-changeover"), href: family("lt-panels") },
      { name: "Floor distribution boards", image: product("lt-distribution-board"), href: family("lt-panels") },
    ],
    watch: [
      "Metering approved by your utility, for every flat",
      "Small electrical rooms: compact gear that fits",
      "Safe, low-noise equipment close to homes",
    ],
  },
  {
    id: "commercial",
    name: "Commercial buildings",
    question: "What electrical equipment does a commercial building need?",
    summary: "Offices, malls and hotels where tenants change and loads grow.",
    photo: { src: "/images/projects/commercial.webp", width: 1600, height: 1067, alt: "Glass office towers seen from street level" },
    needs: [
      { name: "Dry-type transformer", image: product("transformer-dry-cast-resin"), href: family("transformers") },
      { name: "PCC with ACB incomers", image: product("lt-pcc-acb-incomers"), href: family("lt-panels") },
      { name: "APFC panel", href: family("lt-panels") },
      { name: "Sub-distribution boards", image: product("enclosure-modular-distribution"), href: family("enclosures-junction-boxes") },
      { name: "Changeover (ATS)", image: product("lt-ats-changeover"), href: family("lt-panels") },
    ],
    watch: [
      "Power-factor penalties on the electricity bill",
      "Spare capacity for future tenants",
      "Maintenance without shutting floors down",
    ],
  },
  {
    id: "it-parks",
    name: "IT parks",
    question: "What electrical equipment does an IT park need?",
    summary: "Campuses that run day and night, where a minute down costs more than the panel.",
    photo: { src: "/images/projects/it-parks.webp", width: 1600, height: 1095, alt: "An office campus with a lit footbridge at night" },
    needs: [
      { name: "RMUs in a ring", href: family("mv-switchgear-rmu") },
      { name: "Dry-type transformers", image: product("transformer-dry-cast-resin"), href: family("transformers") },
      { name: "PCC with dual incomers", image: product("lt-pcc-acb-incomers"), href: family("lt-panels") },
      { name: "Automatic changeover", image: product("lt-ats-changeover"), href: family("lt-panels") },
      { name: "Busbars and supports", image: product("busbars-copper-supports"), href: family("parts") },
    ],
    watch: [
      "Redundancy at every level, with no single point of failure",
      "Harmonics from UPS and IT loads",
      "Separate metering for every tenant",
    ],
  },
  {
    id: "industries",
    name: "Industries",
    question: "What electrical equipment does an industrial plant need?",
    summary: "Motors, heat and dust: equipment that has to survive the shop floor.",
    photo: { src: "/images/projects/industries.webp", width: 1600, height: 1064, alt: "Inside a heavy industrial plant with overhead cranes" },
    needs: [
      { name: "Power transformer", image: product("transformer-power-onaf"), href: family("transformers") },
      { name: "MCC with draw-out feeders", image: product("lt-mcc-drawout-feeders"), href: family("lt-panels") },
      { name: "PLC automation panel", image: product("lt-plc-panel-hmi"), href: family("lt-panels") },
      { name: "APFC panel", href: family("lt-panels") },
      { name: "IP-rated enclosures", image: product("enclosure-multi-section-lineup"), href: family("enclosures-junction-boxes") },
    ],
    watch: [
      "Motor starting currents and drive loads",
      "Dust, heat and moisture: the right IP rating",
      "Spares and serviceability to keep lines running",
    ],
  },
];

export const TRACK_RECORD =
  "25+ years in power distribution with its group companies: projects for KPTCL, and licensed EPC work for BESCOM and other public discoms";

// Questions buyers and answer engines ask, answered only with what the About page shows.
export function aboutFaq(): { q: string; a: string }[] {
  return [
    {
      q: "Who is GoodBiz Power Systems?",
      a: `An Indian exporter and supplier of electrical equipment with ${TRACK_RECORD}. It recommends the right products for each project and supplies everything from the RMU to the last enclosure in one order. It does not manufacture; it sources from partner manufacturers and tests every order before it ships.`,
    },
    ...projectTypes.map((p) => ({
      q: p.question,
      a: `${p.name} typically need: ${p.needs.map((n) => n.name).join(", ")}. What to watch for: ${p.watch.join("; ")}. GoodBiz Power Systems supplies all of it in one order.`,
    })),
  ];
}
