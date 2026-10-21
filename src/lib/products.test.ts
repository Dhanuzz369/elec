import { existsSync } from "node:fs";
import path from "node:path";
import { getFamily } from "@/data/products";

const onDisk = (src: string) => existsSync(path.join(process.cwd(), "public", src));

test("transformers show the three transformer photos", () => {
  const g = getFamily("transformers")!.gallery ?? [];
  expect(g.map((p) => p.src)).toEqual([
    "/images/products/transformer-oil-onan.webp",
    "/images/products/transformer-power-onaf.webp",
    "/images/products/transformer-dry-cast-resin.webp",
  ]);
});

test("busbars and parts show the three parts photos", () => {
  const g = getFamily("parts")!.gallery ?? [];
  expect(g.map((p) => p.src)).toEqual([
    "/images/products/busbars-copper-supports.webp",
    "/images/products/insulators-epoxy-shrouds.webp",
    "/images/products/terminals-lugs-ducts.webp",
  ]);
});

test("LT panels show the five LT panel photos", () => {
  expect((getFamily("lt-panels")!.gallery ?? []).map((p) => p.src)).toEqual([
    "/images/products/lt-pcc-acb-incomers.webp",
    "/images/products/lt-mcc-drawout-feeders.webp",
    "/images/products/lt-plc-panel-hmi.webp",
    "/images/products/lt-ats-changeover.webp",
    "/images/products/lt-distribution-board.webp",
  ]);
});

test("MV switchgear and RMU show the six cabinet and feeder-pillar photos", () => {
  expect((getFamily("mv-switchgear-rmu")!.gallery ?? []).map((p) => p.src)).toEqual([
    "/images/products/enclosure-modular-distribution.webp",
    "/images/products/enclosure-outdoor-feeder-pillar.webp",
    "/images/products/enclosure-compartment-cabinet.webp",
    "/images/products/enclosure-metering-cabinet.webp",
    "/images/products/enclosure-pedestal-cabinet.webp",
    "/images/products/enclosure-multi-section-lineup.webp",
  ]);
});

test("enclosures show the six enclosure and junction-box photos", () => {
  expect((getFamily("enclosures-junction-boxes")!.gallery ?? []).map((p) => p.src)).toEqual([
    "/images/products/enc-outdoor-pedestal-canopy.webp",
    "/images/products/enc-modular-floor-two-bay.webp",
    "/images/products/enc-wall-mount-steel.webp",
    "/images/products/enc-polycarbonate-junction-boxes.webp",
    "/images/products/enc-grp-meter-boxes.webp",
    "/images/products/enc-outdoor-grp-kiosk.webp",
  ]);
});

test("every gallery photo exists and has alt text and a caption", () => {
  for (const slug of ["transformers", "parts", "lt-panels", "enclosures-junction-boxes", "mv-switchgear-rmu"]) {
    for (const p of getFamily(slug)!.gallery ?? []) {
      expect(onDisk(p.src), p.src).toBe(true);
      expect(p.alt.length).toBeGreaterThan(20);
      expect(p.caption.length).toBeGreaterThan(3);
    }
  }
});
