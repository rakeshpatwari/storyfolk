import { CANON, likenessOf } from "@/lib/likeness";

export function LikenessIndicator({ scores }: { scores: Record<string, number> }) {
  const matches = likenessOf(scores);
  return (
    <section className="likeness" aria-label="Character resemblance">
      <h3 className="text-xs font-semibold text-muted">Character resemblance</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {matches.map((match) => (
          <span key={match.id} className="likeness-match" title={match.work}>
            <span>
              {match.name}
              <span className="block text-muted">{match.work}</span>
            </span>
            <span className="font-semibold tabular-nums">{match.pct}%</span>
          </span>
        ))}
      </div>
      <details className="mt-2 text-xs text-muted">
        <summary className="cursor-pointer py-2">How is this compared?</summary>
        <p className="max-w-prose pb-2 leading-relaxed">
          Illustrative resemblance across the nine core traits, using hand-authored character
          profiles. Higher percentages mean closer trait settings, not a probability or an official
          character assessment. Optional and custom traits don’t affect these matches.
        </p>
        <p className="mb-2 font-semibold">
          Compared with {CANON.length} characters, including Telugu and Hindi cinema
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CANON.map((figure) => (
            <li key={figure.id}>
              {figure.name}
              <span className="block text-muted">{figure.work}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
