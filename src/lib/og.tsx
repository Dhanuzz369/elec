import { ImageResponse } from "next/og";

// Image routes cannot read CSS variables; these mirror the tokens in globals.css.
const C = { bg: "#e9f8ec", accent: "#8fe3c6", accentDeep: "#5ccaa6", ink: "#0d2e25", action: "#0f5a47" };

export const OG_SIZE = { width: 1200, height: 630 };

function Motif({ size, stroke, color }: { size: number; stroke: number; color: string }) {
  const r = size * 0.36;
  return (
    <svg width={size * 1.6} height={size} viewBox={`0 0 ${size * 1.6} ${size}`}>
      <circle cx={size * 0.55} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={size * 1.05} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} />
    </svg>
  );
}

export function renderOg(title: string, label = "GoodBiz") {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.bg, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            right: -160,
            top: 40,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: C.accent,
            display: "flex",
          }}
        />
        <div style={{ position: "absolute", right: 40, top: 150, display: "flex" }}>
          <Motif size={330} stroke={10} color={C.ink} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: 760,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.02, color: C.ink, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, color: C.ink }}>
            <Motif size={44} stroke={4} color={C.action} />
            {label}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

export function renderMark(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
        }}
      >
        <Motif size={size * 0.62} stroke={Math.max(2, size * 0.07)} color={C.action} />
      </div>
    ),
    { width: size, height: size },
  );
}
