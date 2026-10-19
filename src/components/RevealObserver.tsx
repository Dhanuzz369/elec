"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ITEM = "[data-reveal], [data-reveal-circle]";

// Reveals content once as it enters the viewport.
// A [data-stagger] group is observed as a whole and its direct children arrive
// in 70ms steps, so heading, text and picture land in order (and children that
// start clipped out of view, like the footer blocks, still get revealed).
// Content is only hidden once JS has run (.js on <html>).
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");

    const reveal = (el: Element) => {
      if (el.hasAttribute("data-stagger")) {
        el.querySelectorAll<HTMLElement>(`:scope > :is(${ITEM})`).forEach((child) => {
          child.dataset.in = "true";
        });
      } else {
        (el as HTMLElement).dataset.in = "true";
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      group.querySelectorAll<HTMLElement>(`:scope > :is(${ITEM})`).forEach((el, i) => {
        el.style.setProperty("--d", `${i * 70}ms`);
      });
      io.observe(group);
    });

    document.querySelectorAll<HTMLElement>(ITEM).forEach((el) => {
      if (el.dataset.in === "true") return;
      if (el.parentElement?.closest("[data-stagger]") === el.parentElement) return;
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
