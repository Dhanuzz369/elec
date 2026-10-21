// SAMPLE LIST — replace with the component brands GoodBiz Power Systems actually sources.
// Logos are single-colour SVGs in /public/brands/ (Siemens and Schneider Electric from
// Simple Icons, CC0). Brands without a logo file show their name until one is added.
export type Brand = { name: string; logo?: string };

export const brands: Brand[] = [
  { name: "ABB" },
  { name: "Schneider Electric", logo: "/brands/schneiderelectric.svg" },
  { name: "Siemens", logo: "/brands/siemens.svg" },
  { name: "Lauritz Knudsen" },
  { name: "Legrand" },
  { name: "Eaton" },
];
