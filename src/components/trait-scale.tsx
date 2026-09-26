import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import type { TraitDef } from "@/lib/traits";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TraitScale({
  trait,
  value,
  onChange,
  onRemove,
  onEditStep,
}: {
  trait: TraitDef;
  value: number;
  onChange: (n: number) => void;
  onRemove?: () => void;
  onEditStep?: (index: number, text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const step = trait.steps[value - 1] ?? trait.steps[2];

  return (
    <article className="trait-control">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`scale-${trait.id}`} className="text-sm font-semibold">
          {trait.name}
        </label>
        <div className="flex items-center gap-2">
          <output htmlFor={`scale-${trait.id}`} className="text-sm tabular-nums text-muted">
            {value} / 5
          </output>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${trait.name}`}
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <input
        id={`scale-${trait.id}`}
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value} of 5: ${step}`}
        className="trait-slider"
      />
      <p className="text-sm leading-relaxed text-ink">{step}</p>
      <button
        type="button"
        className="mt-3 flex h-11 w-full items-center justify-between rounded-md px-1 text-left text-sm text-muted hover:text-fg"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>All five meanings</span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-[var(--motion-quick)]",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ol className="mt-1 space-y-2 border-t border-border pt-3">
          {trait.steps.map((text, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs tabular-nums",
                  i + 1 === value ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                )}
              >
                {i + 1}
              </span>
              {onEditStep ? (
                <textarea
                  aria-label={`${trait.name} level ${i + 1} meaning`}
                  value={text}
                  onChange={(e) => onEditStep(i, e.target.value)}
                  className="min-h-16 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                />
              ) : (
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    i + 1 === value ? "text-fg" : "text-muted",
                  )}
                >
                  {text}
                </p>
              )}
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}
