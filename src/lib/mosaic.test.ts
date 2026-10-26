import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroMosaic } from "@/components/HeroMosaic";
import { families } from "@/data/products";

const html = renderToStaticMarkup(createElement(HeroMosaic));
const photos = families.reduce((n, f) => n + (f.gallery?.length ?? 0), 0);

test("each photo appears at most twice in the wall", () => {
  expect((html.match(/<img /g) ?? []).length).toBeLessThanOrEqual(photos * 2);
});

test("only the first tile of each column loads eagerly", () => {
  expect((html.match(/loading="eager"/g) ?? []).length).toBeLessThanOrEqual(5);
});

test("no wall image is preloaded or marked high priority", () => {
  expect(html).not.toMatch(/fetchpriority="high"/i);
});
