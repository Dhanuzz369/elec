"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ITEM = "[data-reveal], [data-reveal-circle]";

// Reveals content once as it enters the viewport.
// A [data-stagger] group is observed as a whole and its direct children arrive
// in 70ms steps, so heading, text and picture land in order (and children that
// start clipped out of view, like the footer blocks, still get revealed).
// Content is only hidden once JS has run (.js on <html>), and whatever is already
// on screen at that moment is marked revealed first, so the first view never
// blinks out and back in (which would also push back Largest Contentful Paint).
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const onScreen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight;

    const reveal = (el: Element) => {
      if (el.hasAttribute("data-stagger")) {
        el.querySelectorAll<HTMLElement>(`:scope > :is(${ITEM})`).forEach((child) => {
          child.dataset.in = "true";
        });
      } else {
        (el as HTMLElement).dataset.in = "true";
      }
    };

    document.querySelectorAll("[data-stagger]").forEach((group) => {
      if (onScreen(group)) reveal(group);
    });
    document.querySelectorAll(ITEM).forEach((el) => {
      if (onScreen(el)) (el as HTMLElement).dataset.in = "true";
    });
    document.documentElement.classList.add("js");

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
