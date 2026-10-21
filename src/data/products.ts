// Product families shown on /products and /products/[slug].
// HSN codes follow the Indian Customs Tariff (ITC-HS, 8 digits), checked against
// CBIC-derived listings in Oct 2026. Confirm each code with your customs broker
// before quoting it on a shipping bill.

import type { Faq } from "@/lib/posts";

export type Variant = {
  name: string;
  note: string;
  rating: string;
  hsn: string;
};

export type Family = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  range: { value: string; label: string }[];
  variants: Variant[];
  standards: string[];
  builtFor: string[];
  options: string[];
  faq: Faq[];
  image?: { src: string; alt: string; credit: string };
  // GoodBiz Power Systems' own product photographs, shown in colour.
  gallery?: { src: string; alt: string; caption: string }[];
};

export const families: Family[] = [
  {
    slug: "lt-panels",
    name: "LT panels",
    short: "MCC, PCC, APFC, ATS and PLC panels up to 6300 A.",
    summary:
      "Low-voltage panels built by our partner manufacturers to your single-line diagram, with copper or aluminium busbars and the breaker brand your site already stocks.",
    range: [
      { value: "6300 A", label: "main busbar" },
      { value: "≤ 1 kV", label: "rated voltage" },
      { value: "Form 4b", label: "separation, on request" },
    ],
    variants: [
      { name: "Power distribution (PCC)", note: "Incomers, bus couplers, outgoing feeders", rating: "up to 6300 A", hsn: "85371000" },
      { name: "Motor control centre (MCC)", note: "DOL, star-delta, soft starter and VFD feeders", rating: "up to 4000 A", hsn: "85371000" },
      { name: "PLC and automation panels", note: "PLC, HMI, I/O and marshalling", rating: "control", hsn: "85371000" },
      { name: "ATS and changeover panels", note: "Mains-generator, mains-mains, with interlocks", rating: "up to 4000 A", hsn: "85371000" },
      { name: "APFC and capacitor banks", note: "Detuned reactors, thyristor or contactor switched", rating: "up to 2000 kVAr", hsn: "85371000" },
      { name: "Distribution boards", note: "Lighting and power DBs, sub-main boards", rating: "up to 800 A", hsn: "85371000" },
    ],
    standards: ["IEC 61439-1/2", "IS/IEC 61439", "BS EN 61439", "IEC 61641 arc tested, on request"],
    builtFor: ["Process plants", "Commercial buildings", "Data centres", "Water and wastewater"],
    options: ["Copper or aluminium busbars", "IP31 to IP54", "Front or rear access", "Fixed or withdrawable feeders"],
    gallery: [
      {
        src: "/images/products/lt-pcc-acb-incomers.webp",
        alt: "Power control centre (PCC) line-up with two air circuit breaker incomers, digital meters and a section of outgoing feeder drawers",
        caption: "Power control centre with ACB incomers",
      },
      {
        src: "/images/products/lt-mcc-drawout-feeders.webp",
        alt: "Motor control centre with an ACB incomer, rows of draw-out motor feeder modules and a drive section with a keypad",
        caption: "Motor control centre, draw-out feeders",
      },
      {
        src: "/images/products/lt-plc-panel-hmi.webp",
        alt: "Open PLC automation panel with PLC rack, power supply, relays and terminal blocks, and an HMI touchscreen on the door",
        caption: "PLC panel with door-mounted HMI",
      },
      {
        src: "/images/products/lt-ats-changeover.webp",
        alt: "Open ATS panel with two mechanically interlocked changeover switches, colour-coded busbars and a controller on the door",
        caption: "ATS and changeover panel",
      },
      {
        src: "/images/products/lt-distribution-board.webp",
        alt: "Wall-mounted distribution board with an MCCB incomer and three rows of MCB outgoing feeders",
        caption: "MCCB-incomer distribution board",
      },
    ],
    faq: [
      { q: "What is the HSN code for an MCC or PCC panel?", a: "85371000. India uses one 8-digit line for boards and panels for 1000 V or less, so PCC, MCC, APFC, ATS, PLC panels and distribution boards all ship under it." },
      { q: "What is the largest LT panel GoodBiz Power Systems supplies?", a: "Power distribution panels up to 6300 A main busbar, with copper or aluminium busbars. MCCs go up to 4000 A." },
      { q: "Which standard are the LT panels built to?", a: "IEC 61439-1/2 as standard, with IS/IEC 61439 or BS EN 61439 on request. Arc-fault testing to IEC 61641 is available when the specification asks for it." },
      { q: "Can I choose the breaker brand inside the panel?", a: "Yes. Panels are built by our partner manufacturers with the ACB, MCCB and relay brand your specification or approved vendor list names." },
      { q: "Which enclosure ratings are available for LT panels?", a: "IP31 to IP54, front or rear access, with fixed or withdrawable feeders and Form 4b separation on request." },
    ],
  },
  {
    slug: "mv-switchgear-rmu",
    name: "MV switchgear & RMU",
    short: "AIS and GIS panels and ring main units, 11 to 33 kV.",
    summary:
      "Medium-voltage switchboards and ring main units for utilities, renewables and industrial substations, with VCB or SF6 breaking.",
    range: [
      { value: "33 kV", label: "highest class" },
      { value: "AIS · GIS", label: "insulation" },
      { value: "25 kA", label: "short-time, 3 s" },
    ],
    variants: [
      { name: "Air-insulated switchgear (AIS)", note: "Withdrawable VCB panels, metal-clad", rating: "11–33 kV", hsn: "85372000" },
      { name: "Gas-insulated switchgear (GIS)", note: "Compact SF6 or clean-air panels", rating: "11–33 kV", hsn: "85372000" },
      { name: "Ring main units (RMU)", note: "Extensible or non-extensible, 2 to 5 ways", rating: "11–33 kV", hsn: "85372000" },
      { name: "Vacuum circuit breakers", note: "Indoor and outdoor VCBs", rating: "up to 33 kV", hsn: "85352121 / 85352122" },
      { name: "Load break switches and isolators", note: "Manual or motorised", rating: "up to 33 kV", hsn: "85353090" },
    ],
    standards: ["IEC 62271-100/200", "IEC 62271-1", "IS/IEC 62271", "IAC AFLR, on request"],
    builtFor: ["Utility distribution", "Solar and wind farms", "Industrial substations", "Airports and metros"],
    options: ["SCADA-ready RTU", "Numerical protection relays", "Motorised operation", "Outdoor kiosk housing"],
    gallery: [
      {
        src: "/images/products/enclosure-modular-distribution.webp",
        alt: "Modular multi-door distribution cabinet with meter windows, MCB viewing windows and quarter-turn door locks",
        caption: "Modular distribution cabinet",
      },
      {
        src: "/images/products/enclosure-outdoor-feeder-pillar.webp",
        alt: "Outdoor feeder pillar on a steel stand with a rain canopy, MCB rows and industrial sockets on the side",
        caption: "Outdoor feeder pillar with canopy",
      },
      {
        src: "/images/products/enclosure-compartment-cabinet.webp",
        alt: "Compartmentalised floor-standing cabinet with separate doors for incomer, metering and outgoing sections",
        caption: "Compartmentalised floor cabinet",
      },
      {
        src: "/images/products/enclosure-metering-cabinet.webp",
        alt: "Multi-compartment metering cabinet with meter viewing windows, MCB windows and a large viewing panel",
        caption: "Multi-meter cabinet",
      },
      {
        src: "/images/products/enclosure-pedestal-cabinet.webp",
        alt: "Pedestal-mounted metering and distribution cabinet on a steel stand, with meter windows and an MCB viewing window",
        caption: "Pedestal metering cabinet",
      },
      {
        src: "/images/products/enclosure-multi-section-lineup.webp",
        alt: "Long multi-section cabinet line-up with incomer sections and rows of feeder compartments with viewing windows",
        caption: "Multi-section cabinet line-up",
      },
    ],
    faq: [
      { q: "What is the HSN code for an RMU?", a: "85372000. A complete ring main unit is a board for more than 1000 V, so it ships under 85372000 together with MV switchgear panels." },
      { q: "What voltage range does the MV switchgear cover?", a: "11 kV to 33 kV, air-insulated (AIS) or gas-insulated (GIS), with short-time ratings up to 25 kA for 3 seconds." },
      { q: "What is the HSN code for a vacuum circuit breaker?", a: "85352121 for an 11 kV VCB and 85352122 for 33 kV. Breakers fitted inside a panel ship with the panel under 85372000." },
      { q: "Which standards apply to MV switchgear and RMUs?", a: "IEC 62271-100, IEC 62271-200 and IEC 62271-1, with internal arc classification IAC AFLR on request." },
      { q: "Can RMUs be supplied SCADA-ready?", a: "Yes. RMUs and switchboards can be supplied with an RTU, numerical protection relays and motorised operation for remote switching." },
    ],
    image: {
      src: "/images/high-voltage-switchgear-29.jpg",
      alt: "Outdoor circuit breakers and busbars in a substation",
      credit: "Novoklimov, CC BY 4.0",
    },
  },
  {
    slug: "transformers",
    name: "Transformers",
    short: "Oil-filled and dry-type: distribution, power and converter duty.",
    summary:
      "Distribution, power and converter transformers with copper or aluminium windings, sourced from IEC-tested manufacturers and supplied with the oil, radiators and rating plate your grid expects.",
    range: [
      { value: "2500 kVA", label: "distribution class" },
      { value: "33 kV", label: "primary voltage" },
      { value: "ONAN · ONAF", label: "cooling" },
    ],
    variants: [
      { name: "Oil-filled distribution", note: "Hermetically sealed or conservator type", rating: "up to 650 kVA", hsn: "85042100" },
      { name: "Oil-filled power", note: "OLTC or off-circuit tap changer", rating: "650–10 000 kVA", hsn: "85042200" },
      { name: "Large power", note: "Substation and generator step-up", rating: "above 10 MVA", hsn: "85042310–40" },
      { name: "Dry-type (cast resin)", note: "Indoor, low fire risk", rating: "up to 3150 kVA", hsn: "85043300 / 85043400" },
      { name: "Converter and inverter duty", note: "Solar, VFD and rectifier duty", rating: "to order", hsn: "85042200" },
    ],
    standards: ["IEC 60076", "IS 1180", "IS 2026", "Ecodesign / EU Tier 2, on request"],
    builtFor: ["Utility distribution", "Solar parks", "Industrial plants", "Compact substations"],
    options: ["Copper or aluminium windings", "Mineral or ester oil", "OLTC with RTCC", "Bilingual rating plate"],
    faq: [
      { q: "What is the HSN code for an oil-filled distribution transformer?", a: "85042100 up to 650 kVA and 85042200 from 650 kVA to 10 MVA. Above 10 MVA the codes run from 85042310 to 85042340 by rating." },
      { q: "What is the HSN code for a dry-type transformer?", a: "85043300 for cast-resin units from 16 kVA to 500 kVA and 85043400 above 500 kVA." },
      { q: "Which standards do the transformers meet?", a: "IEC 60076 as standard, with IS 1180 and IS 2026 where specified, and Ecodesign or EU Tier 2 losses on request." },
      { q: "Can the rating plate be in the site's language?", a: "Yes. Rating plates can be bilingual, for example Arabic and English for Saudi Arabia and Kuwait." },
      { q: "Copper or aluminium windings?", a: "Both are available. State your preference in the enquiry, along with mineral or ester oil and the cooling class, ONAN or ONAF." },
    ],
    gallery: [
      {
        src: "/images/products/transformer-oil-onan.webp",
        alt: "Oil-filled distribution transformer with conservator tank, three HV bushings, LV bushings and radiator banks",
        caption: "Oil-filled distribution, ONAN",
      },
      {
        src: "/images/products/transformer-power-onaf.webp",
        alt: "Oil-filled power transformer with tall HV bushings and radiator banks fitted with cooling fans",
        caption: "Power transformer, ONAF",
      },
      {
        src: "/images/products/transformer-dry-cast-resin.webp",
        alt: "Dry-type cast-resin transformer with three red resin coils and copper terminal pads on a steel frame",
        caption: "Dry-type, cast resin",
      },
    ],
  },
  {
    slug: "substations",
    name: "Compact & package substations",
    short: "Factory-built substations up to 2500 kVA at 11, 22 and 33 kV.",
    summary:
      "MV switchgear, transformer and LV board in one enclosure, wired and tested at the manufacturer's works so the site only needs a plinth and cables.",
    range: [
      { value: "2500 kVA", label: "transformer" },
      { value: "11 · 22 · 33 kV", label: "class" },
      { value: "1 lift", label: "site installation" },
    ],
    variants: [
      { name: "Compact secondary substations", note: "RMU, transformer and LV board in one kiosk", rating: "up to 2500 kVA", hsn: "85372000" },
      { name: "Package substations", note: "Skid or containerised, tailored layouts", rating: "to order", hsn: "85372000" },
      { name: "Solar inverter stations", note: "Inverter-duty transformer with RMU", rating: "up to 6.6 MVA", hsn: "85372000" },
    ],
    standards: ["IEC 62271-202", "IEC 60076", "IEC 61439"],
    builtFor: ["Housing and townships", "Solar parks", "Industrial estates", "Temporary power"],
    options: ["Walk-in or non-walk-in", "GRP, steel or concrete housing", "Internal arc classified", "Metering compartment"],
    faq: [
      { q: "What is a compact substation?", a: "A factory-assembled unit with an RMU, a transformer and an LV board in one enclosure, wired and tested at the manufacturer's works so the site needs only a plinth and cables." },
      { q: "What ratings do the compact substations cover?", a: "Up to 2500 kVA at 11 kV, 22 kV and 33 kV class, built to IEC 62271-202." },
      { q: "Which HSN code applies to a compact substation?", a: "There is no separate tariff line. It is usually declared under 85372000 when the switchgear is the main function, or under the transformer line when the transformer is." },
      { q: "Are solar inverter stations available?", a: "Yes. Inverter-duty transformers with an RMU in one skid are supplied up to 6.6 MVA." },
    ],
    image: {
      src: "/images/electrical-substation-in-cerepova-daugavpils.jpg",
      alt: "An outdoor electrical substation in winter with gantries and lightning masts",
      credit: "mihalich.barak, CC BY 3.0",
    },
  },
  {
    slug: "breakers-contactors",
    name: "Breakers & contactors",
    short: "ACB, MCCB, MCB and industrial contactors.",
    summary:
      "Protection and switching devices supplied loose or fitted into panels, sourced from the brand your specification names.",
    range: [
      { value: "6300 A", label: "ACB frame" },
      { value: "100 kA", label: "breaking capacity" },
      { value: "AC-3", label: "contactor duty" },
    ],
    variants: [
      { name: "Air circuit breakers (ACB)", note: "Fixed or draw-out, with release units", rating: "800–6300 A", hsn: "85362010" },
      { name: "Moulded case breakers (MCCB)", note: "Thermal-magnetic or electronic release", rating: "16–1600 A", hsn: "85362020" },
      { name: "Miniature breakers (MCB)", note: "B, C and D curves, 1 to 4 poles", rating: "0.5–125 A", hsn: "85362030" },
      { name: "Residual current devices", note: "RCCB and RCBO", rating: "up to 125 A", hsn: "85362040" },
      { name: "Industrial contactors", note: "Power and auxiliary contactors", rating: "9–800 A", hsn: "85364900" },
      { name: "Relays", note: "Control and protection relays", rating: "≤ 60 V coil", hsn: "85364100" },
    ],
    standards: ["IEC 60947-2", "IEC 60947-4-1", "IEC 60898-1", "IEC 61008/61009"],
    builtFor: ["Panel builders", "Contractors' site stock", "Spares for existing boards"],
    options: ["Brand of your choice", "Motor operators and shunt trips", "Interlocks", "Test certificates per lot"],
    faq: [
      { q: "What are the HSN codes for ACB, MCCB and MCB?", a: "85362010 for air circuit breakers, 85362020 for MCCBs and 85362030 for MCBs, all for 1000 V or less." },
      { q: "What is the HSN code for an RCCB or RCBO?", a: "85362040, the Indian line for earth-leakage and residual current breakers." },
      { q: "What is the HSN code for an industrial contactor?", a: "Contactors are commonly declared under 85364900. Some exporters use 85365010, so confirm the line with your customs broker." },
      { q: "Which brands of breakers can GoodBiz Power Systems supply?", a: "The brand your specification names. Breakers are sourced from that brand and supplied loose or fitted into panels, with test certificates for each lot." },
    ],
  },
  {
    slug: "enclosures-junction-boxes",
    name: "Enclosures & junction boxes",
    short: "Empty panel cabinets, industrial enclosures and junction boxes.",
    summary:
      "Unfitted cabinets and boxes for panel builders and site contractors, powder-coated to your RAL shade and cut to your gland plan.",
    range: [
      { value: "IP66", label: "highest rating" },
      { value: "2 mm", label: "CRCA, typical" },
      { value: "RAL", label: "any shade" },
    ],
    variants: [
      { name: "Modular panel cabinets", note: "Floor-standing, bolted frame", rating: "up to 2400 mm", hsn: "85381010" },
      { name: "Wall-mount enclosures", note: "Single and double door", rating: "IP55–IP66", hsn: "85381090" },
      { name: "Junction boxes", note: "Steel, stainless or polycarbonate", rating: "IP65–IP66", hsn: "85369030" },
      { name: "Outdoor kiosks", note: "Canopy and double-wall options", rating: "IP54+", hsn: "85381090" },
    ],
    standards: ["IEC 62208", "IEC 60529", "IK08–IK10"],
    builtFor: ["Panel builders", "Instrumentation contractors", "Telecom and solar sites"],
    options: ["CRCA, galvanised or SS316", "Cut-outs and gland plates", "Mounting plates", "Canopies and plinths"],
    gallery: [
      {
        src: "/images/products/enc-outdoor-pedestal-canopy.webp",
        alt: "Outdoor pedestal enclosure with a rain canopy, a viewing window, louvred side vents and a lockable lower compartment with mounting plate",
        caption: "Outdoor pedestal enclosure with canopy",
      },
      {
        src: "/images/products/enc-modular-floor-two-bay.webp",
        alt: "Two-bay modular floor-standing enclosure on a plinth, one bay open to show the punched rack frame and galvanised mounting plate",
        caption: "Modular floor-standing enclosure",
      },
      {
        src: "/images/products/enc-wall-mount-steel.webp",
        alt: "Two wall-mount steel enclosures with gasketed doors, quarter-turn locks, galvanised mounting plate and door earth strap",
        caption: "Wall-mount steel enclosures",
      },
      {
        src: "/images/products/enc-polycarbonate-junction-boxes.webp",
        alt: "Three grey polycarbonate junction boxes: a hinged-lid box, a screw-cover box and an open box with gasket and brass inserts",
        caption: "Polycarbonate junction boxes",
      },
      {
        src: "/images/products/enc-grp-meter-boxes.webp",
        alt: "White GRP meter enclosures with hinged doors and clear viewing windows for meters and MCBs",
        caption: "GRP meter boxes with viewing windows",
      },
      {
        src: "/images/products/enc-outdoor-grp-kiosk.webp",
        alt: "Outdoor GRP kiosk with two lockable doors, louvred vents, a raised base and an internal mounting frame",
        caption: "Outdoor GRP kiosk, double door",
      },
    ],
    faq: [
      { q: "What is the HSN code for an empty panel enclosure?", a: "85381010 for unfitted cabinets for industrial use and 85381090 for other unfitted boards and cabinets." },
      { q: "What is the HSN code for a junction box?", a: "85369030, the Indian line for junction boxes for 1000 V or less." },
      { q: "Which IP ratings are available for enclosures?", a: "From IP54 for outdoor kiosks up to IP66 for wall-mount enclosures and junction boxes, to IEC 60529 and IEC 62208." },
      { q: "Which materials and finishes are available?", a: "CRCA, galvanised or SS316 steel, or polycarbonate for junction boxes, powder-coated to any RAL shade and cut to your gland plan." },
    ],
  },
  {
    slug: "parts",
    name: "Busbars & panel parts",
    short: "Busbars, supports, terminals and spares.",
    summary:
      "The parts that keep panels and switchgear running: busbar systems, insulators, terminals and the spares your maintenance team asks for.",
    range: [
      { value: "Cu · Al", label: "busbars" },
      { value: "SMC · DMC", label: "insulators" },
      { value: "OEM", label: "spares matched" },
    ],
    variants: [
      { name: "Busbars and busbar supports", note: "Tinned or bare, punched to drawing", rating: "to 6300 A", hsn: "85389000" },
      { name: "Insulators and shrouds", note: "SMC, DMC and epoxy", rating: "LV and MV", hsn: "85389000" },
      { name: "Terminals and wiring accessories", note: "DIN rail terminals, lugs, ducts", rating: "LV", hsn: "85369090" },
      { name: "Switchgear spares", note: "Shutters, trucks, mechanisms", rating: "LV and MV", hsn: "85389000" },
    ],
    standards: ["IEC 61439", "IEC 62271", "Drawing or sample matched"],
    builtFor: ["Panel builders", "Maintenance teams", "Retrofit projects"],
    options: ["Silver or tin plating", "Heat-shrink sleeving", "Kits per panel", "Mixed-lot shipping"],
    gallery: [
      {
        src: "/images/products/busbars-copper-supports.webp",
        alt: "Three copper busbars bolted to red SMC busbar supports, with two tinned flexible busbar links",
        caption: "Copper busbars on SMC supports",
      },
      {
        src: "/images/products/insulators-epoxy-shrouds.webp",
        alt: "Red epoxy post insulators of two heights, a cream support insulator and two red insulating shrouds",
        caption: "Epoxy insulators and shrouds",
      },
      {
        src: "/images/products/terminals-lugs-ducts.webp",
        alt: "DIN-rail terminal blocks with earth terminals, copper and tinned cable lugs, and slotted wiring ducts",
        caption: "Terminals, lugs and wiring ducts",
      },
    ],
    faq: [
      { q: "What is the HSN code for switchgear parts?", a: "85389000 covers parts for boards and switchgear under headings 8535 to 8537, such as busbars, insulators, shutters and mechanisms." },
      { q: "What is the HSN code for terminals and connectors?", a: "85369090 for terminal blocks, connectors and lugs for 1000 V or less." },
      { q: "Can spares be matched to an existing panel?", a: "Yes. Spares are matched to your drawing or sample, and supplied as kits per panel when needed." },
      { q: "Are busbars supplied plated?", a: "Copper busbars can be supplied bare, tin-plated or silver-plated, punched to drawing and sleeved." },
    ],
  },
  {
    slug: "switchyard-cables-ups",
    name: "Switchyard, cables & UPS",
    short: "Outdoor switchyard to 220 kV, HT and LT cables, UPS and batteries.",
    summary:
      "Everything around the panels: outdoor switchyard equipment, power cables in copper and aluminium, and the UPS, batteries and chargers that keep control power alive.",
    range: [
      { value: "220 kV", label: "switchyard" },
      { value: "HT · LT", label: "cables, Al and Cu" },
      { value: "UPS", label: "batteries and chargers" },
    ],
    variants: [
      { name: "Outdoor switchyard equipment", note: "Breakers, isolators, CTs, PTs, arresters", rating: "up to 220 kV", hsn: "85352912" },
      { name: "HT / MV power cables", note: "XLPE, armoured, Al or Cu", rating: "up to 33 kV", hsn: "85446020" },
      { name: "LV power and control cables", note: "PVC or XLPE, armoured", rating: "≤ 1.1 kV", hsn: "85444920" },
      { name: "UPS systems", note: "Online, industrial grade", rating: "1–800 kVA", hsn: "85044090" },
      { name: "Batteries and chargers", note: "VRLA, Ni-Cd, lithium; float-boost chargers", rating: "to order", hsn: "85072000" },
    ],
    standards: ["IEC 62271", "IEC 60502", "IEC 62040", "IEC 60896"],
    builtFor: ["Utility substations", "Power plants", "Process plants"],
    options: ["Drum lengths to order", "Fire-survival cables", "Battery racks and DCDBs", "Site-wise packing"],
    faq: [
      { q: "What is the HSN code for HT power cable?", a: "85446020 for XLPE or PVC insulated cable above 1000 V. LV power and control cable without connectors is 85444920." },
      { q: "What is the HSN code for a 220 kV circuit breaker?", a: "85352912 for a 220 kV SF6 circuit breaker. Lightning arresters for the switchyard are 85354010." },
      { q: "What is the HSN code for a UPS?", a: "A UPS is usually declared under 85044090. Battery chargers are 85044030 and lead-acid batteries 85072000." },
      { q: "Which switchyard equipment can be supplied?", a: "Breakers, isolators, CTs, PTs and lightning arresters up to 220 kV, sourced to IEC 62271." },
    ],
    image: {
      src: "/images/chilime-switchyard.jpg",
      alt: "An outdoor hydropower switchyard with lattice gantries in a mountain valley",
      credit: "Lipiram, CC BY 3.0",
    },
  },
];

export function getFamily(slug: string) {
  return families.find((f) => f.slug === slug);
}
