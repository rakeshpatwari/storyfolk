import { LikenessIndicator } from "@/components/likeness-indicator";
import { Copy, Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Portrait } from "@/lib/portrait";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-subtle">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-ink">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DossierPanel({
  portrait,
  onCopy,
  scores,
  identity,
}: {
  portrait: Portrait;
  identity: ReactNode;
  scores: Record<string, number>;
  onCopy: () => Promise<void> | void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await onCopy();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="dossier-panel rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="dossier-identity-header">
        {identity}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="dossier-copy"
          aria-label={copied ? "Dossier copied" : "Copy dossier"}
          title={copied ? "Copied" : "Copy dossier"}
          onClick={() => void copy()}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>

      <p className="mt-4 font-display text-lg leading-snug text-fg">{portrait.archetype}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink">{portrait.portrait}</p>
      <p className="mt-3 text-sm text-muted">{portrait.intensity}</p>
      <p className="mt-3 text-sm text-ink">{portrait.cognitive}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {portrait.peaks.map((p) => (
          <Badge key={p.id} className="text-fg">
            Peak {p.name} {p.score}
          </Badge>
        ))}
        {portrait.valleys.map((p) => (
          <Badge key={p.id}>
            Valley {p.name} {p.score}
          </Badge>
        ))}
      </div>

      <LikenessIndicator scores={scores} />

      <Section title="Behaviors in a scene" items={portrait.behaviors} />
      <Section title="Backstory leads" items={portrait.backstory} />
      <Section title="Relationships" items={portrait.relationships} />
      <Section title="Conflict" items={portrait.conflicts} />
      <Section title="Voice" items={portrait.voice} />
      <Section title="Scene prompts" items={portrait.scenes} />
    </div>
  );
}
