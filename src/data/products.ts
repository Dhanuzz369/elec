// Product families shown on /products and /products/[slug].
// HSN codes follow the Indian Customs Tariff (ITC-HS, 8 digits), checked against
// CBIC-derived listings in Oct 2026. Confirm each code with your customs broker
// before quoting it on a shipping bill.

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
  image?: { src: string; alt: string; credit: string };
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
    image: {
      src: "/images/a-power-transformer-mounted-on-a-wooden.jpg",
      alt: "A pole-mounted distribution transformer with three insulators against the sky",
      credit: "Moses Cursor Ssebunya, CC0",
    },
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
  },
  {
    slug: "parts",
    name: "Panel & switchgear parts",
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
