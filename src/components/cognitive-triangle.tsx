import { COGNITIVE_IDS } from "@/lib/traits";

const LABELS = [
  { id: "intellect", label: "Intellect", x: 160, y: 28 },
  { id: "analytical", label: "Analytical", x: 28, y: 268 },
  { id: "creativity", label: "Creative", x: 292, y: 268 },
] as const;

const VERTICES = {
  intellect: { x: 160, y: 48 },
  analytical: { x: 36, y: 244 },
  creativity: { x: 284, y: 244 },
};

function lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function CognitiveTriangle({ scores }: { scores: Record<string, number> }) {
  const intel = scores.intellect ?? 3;
  const anal = scores.analytical ?? 3;
  const crea = scores.creativity ?? 3;
  const cx = (VERTICES.intellect.x + VERTICES.analytical.x + VERTICES.creativity.x) / 3;
  const cy = (VERTICES.intellect.y + VERTICES.analytical.y + VERTICES.creativity.y) / 3;
  const center = { x: cx, y: cy };

  const pI = lerp(center, VERTICES.intellect, intel / 5);
  const pA = lerp(center, VERTICES.analytical, anal / 5);
  const pC = lerp(center, VERTICES.creativity, crea / 5);

  const sum = intel + anal + crea || 1;
  const bary = {
    x:
      (intel * VERTICES.intellect.x +
        anal * VERTICES.analytical.x +
        crea * VERTICES.creativity.x) /
      sum,
    y:
      (intel * VERTICES.intellect.y +
        anal * VERTICES.analytical.y +
        crea * VERTICES.creativity.y) /
      sum,
  };

  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Cognitive triangle
          </h2>
          <p className="mt-1 text-sm text-muted">
            The shape leans toward the strongest mental trait. The dot marks the balance point.
          </p>
        </div>
      </div>
      <svg viewBox="0 0 320 292" className="mx-auto block h-auto w-full max-w-sm" role="img">
        <title>Cognitive triangle</title>
        <polygon
          points={`${VERTICES.intellect.x},${VERTICES.intellect.y} ${VERTICES.analytical.x},${VERTICES.analytical.y} ${VERTICES.creativity.x},${VERTICES.creativity.y}`}
          fill="none"
          stroke="currentColor"
          className="text-border-strong"
          strokeWidth="1"
        />
        {[1, 2, 3, 4].map((n) => {
          const t = n / 5;
          const a = lerp(center, VERTICES.intellect, t);
          const b = lerp(center, VERTICES.analytical, t);
          const c = lerp(center, VERTICES.creativity, t);
          return (
            <polygon
              key={n}
              points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`}
              fill="none"
              stroke="currentColor"
              className="text-border"
              strokeWidth="0.6"
            />
          );
        })}
        <polygon
          points={`${pI.x},${pI.y} ${pA.x},${pA.y} ${pC.x},${pC.y}`}
          fill="color-mix(in oklab, var(--color-accent) 22%, transparent)"
          stroke="currentColor"
          className="text-accent"
          strokeWidth="1.4"
        />
        <circle cx={bary.x} cy={bary.y} r="4.5" className="fill-accent" />
        {LABELS.map((l) => (
          <text
            key={l.id}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: 11, fontFamily: "var(--font-sans)" }}
          >
            {l.label} {(scores[l.id] ?? 3).toFixed(0)}
          </text>
        ))}
      </svg>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
        {COGNITIVE_IDS.map((id) => (
          <div key={id}>
            <dt className="text-[11px] uppercase tracking-wider text-subtle">
              {id === "analytical" ? "Analytical" : id === "creativity" ? "Creative" : "Intellect"}
            </dt>
            <dd className="font-display text-2xl tabular-nums text-fg">{scores[id] ?? 3}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
