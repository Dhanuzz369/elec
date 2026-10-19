// The one motif: the single-line-diagram symbol for a two-winding transformer,
// two linked circles (primary and secondary). Used as logo, bullet, mask and ring.

type Props = {
  className?: string;
  strokeWidth?: number;
  title?: string;
};

export function TransformerSymbol({ className, strokeWidth = 2.4, title }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 24"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle className="motif-ring" cx="13" cy="12" r="9.5" strokeWidth={strokeWidth} />
      <circle className="motif-ring" cx="27" cy="12" r="9.5" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function Bullet() {
  return <TransformerSymbol className="bullet" strokeWidth={3} />;
}

// A flat drawing of an oil-filled transformer, used before WebGL loads and on
// product pages that have no photograph yet.
export function TransformerDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" fill="currentColor">
      <rect x="6" y="40" width="34" height="8" />
      <rect x="160" y="40" width="34" height="8" />
      <rect x="44" y="70" width="112" height="100" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={`l${i}`} x={14 + i * 4.5} y="78" width="2.5" height="84" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={`r${i}`} x={162 + i * 4.5} y="78" width="2.5" height="84" />
      ))}
      <rect x="12" y="86" width="32" height="4" />
      <rect x="12" y="150" width="32" height="4" />
      <rect x="156" y="86" width="32" height="4" />
      <rect x="156" y="150" width="32" height="4" />
      {[70, 100, 130].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="22" width="6" height="48" />
          {[28, 36, 44, 52].map((y) => (
            <rect key={y} x={x - 8} y={y} width="16" height="4" />
          ))}
        </g>
      ))}
      <rect x="40" y="172" width="120" height="8" />
      <rect x="50" y="180" width="10" height="12" />
      <rect x="140" y="180" width="10" height="12" />
    </svg>
  );
}
