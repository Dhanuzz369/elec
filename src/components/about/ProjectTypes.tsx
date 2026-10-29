"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { TransformerSymbol } from "@/components/Motif";
import { projectTypes } from "@/data/projects";

const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

// All four panels are always in the HTML. With scripting on, CSS stacks them in one cell and this
// component swaps which one is active; without it, they read one after another and the tabs are hidden.
export function ProjectTypes() {
  const [active, setActive] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const [warm, setWarm] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setWarm(true));
    return () => cancel(id);
  }, []);

  // The highlight is a copy of the list in active colours, clipped to the active row.
  // Rows change height when the web font arrives or the column resizes, so measure again then.
  useLayoutEffect(() => {
    const measure = () => {
      const row = tabs.current[active];
      if (!row || !list.current || !fill.current) return;
      fill.current.style.setProperty("--h", `${list.current.scrollHeight}px`);
      fill.current.style.setProperty("--t", `${row.offsetTop}px`);
      fill.current.style.setProperty("--rh", `${row.offsetHeight}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    tabs.current.forEach((t) => t && ro.observe(t));
    return () => ro.disconnect();
  }, [active, hydrated]);

  function onKeyDown(e: KeyboardEvent) {
    const step = STEP[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + projectTypes.length) % projectTypes.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  const rows = (decor: boolean) =>
    projectTypes.map((p, i) => (
      <button
        key={p.id}
        type="button"
        className="ap-tab"
        {...(decor
          ? { tabIndex: -1 }
          : {
              ref: (el: HTMLButtonElement | null) => {
                tabs.current[i] = el;
              },
              role: "tab",
              id: `tab-${p.id}`,
              "aria-controls": `panel-${p.id}`,
              "aria-selected": i === active,
              tabIndex: i === active ? 0 : -1,
              onClick: () => setActive(i),
            })}
      >
        <span className="ap-tab-n num">0{i + 1}</span>
        <span>{p.name}</span>
        <span className="ap-tab-arrow" aria-hidden="true">
          →
        </span>
      </button>
    ));

  return (
    <div className="ap-stage">
      <div className="ap-tabs" role="tablist" aria-label="Project types" ref={list} onKeyDown={onKeyDown}>
        {rows(false)}
        <div className="ap-tab-fill" ref={fill} aria-hidden="true" inert>
          {rows(true)}
        </div>
      </div>
      <div className="ap-panels">
        {projectTypes.map((p, i) => {
          const on = i === active;
          return (
            <article
              key={p.id}
              id={`panel-${p.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${p.id}`}
              data-project={p.id}
              data-active={on || undefined}
              inert={hydrated && !on ? true : undefined}
              className="ap-panel"
            >
              <div className="ap-photo">
                {/* The hidden panels start lazy (no preload competing with the first photo) and
                    switch to eager once the browser is idle: some browsers never lazy-load an
                    image stacked under another panel. */}
                <Image
                  src={p.photo.src}
                  alt={p.photo.alt}
                  title={p.photo.alt}
                  fill
                  sizes="(max-width: 860px) calc(100vw - 32px), min(840px, 62vw)"
                  priority={i === 0}
                  loading={i === 0 ? undefined : warm ? "eager" : "lazy"}
                />
                <div className="ap-cap">
                  <h3>{p.name}</h3>
                  <p>{p.summary}</p>
                </div>
              </div>
              <div className="ap-detail">
                <div>
                  <p className="ap-k">What it typically needs</p>
                  <ul className="ap-needs">
                    {p.needs.map((n, k) => {
                      const body = (
                        <>
                          <span className="ap-thumb">
                            {n.image ? (
                              <Image src={n.image} alt={n.name} title={n.name} fill sizes="160px" />
                            ) : (
                              <TransformerSymbol className="ap-glyph" />
                            )}
                          </span>
                          <span className="ap-need-name">{n.name}</span>
                        </>
                      );
                      return (
                        <li key={n.name} style={{ "--i": k } as CSSProperties}>
                          {n.href ? <Link href={n.href} title={`${n.name}: see the product family`}>{body}</Link> : body}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <p className="ap-k">What we watch for</p>
                  <ul className="ap-watch">
                    {p.watch.map((w, k) => (
                      <li key={w} style={{ "--i": k } as CSSProperties}>
                        {w}
                      </li>
                    ))}
                  </ul>
                  <Link href="/quote" className="btn" title={`Get a quote for ${p.name.toLowerCase()}`}>
                    Get a quote for this project
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
