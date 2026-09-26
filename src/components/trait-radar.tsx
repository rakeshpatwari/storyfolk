import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { TraitDef } from "@/lib/traits";

export function TraitRadar({
  traits,
  scores,
}: {
  traits: TraitDef[];
  scores: Record<string, number>;
}) {
  const data = traits.map((t) => ({
    trait: t.name,
    value: scores[t.id] ?? 3,
  }));

  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h2 className="font-display text-xl font-semibold tracking-tight text-fg">Scale map</h2>
      <p className="mt-1 text-sm text-muted">
        See the full trait profile. Sharp peaks tend to define the character on the page.
      </p>
      <div className="mt-2 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="52%">
            <PolarGrid stroke="var(--color-border-strong)" />
            <PolarAngleAxis dataKey="trait" tick={{ fill: "var(--color-muted)", fontSize: 9 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} tickCount={6} />
            <Radar
              dataKey="value"
              stroke="var(--color-accent)"
              fill="var(--color-accent)"
              fillOpacity={0.22}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
