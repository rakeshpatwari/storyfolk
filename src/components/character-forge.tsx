import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { Check, CopyPlus, Library, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { CognitiveTriangle } from "@/components/cognitive-triangle";
import { DossierPanel } from "@/components/dossier-panel";
import { TraitRadar } from "@/components/trait-radar";
import { TraitScale } from "@/components/trait-scale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { activeTraits, useForge } from "@/lib/character-store";
import { buildPortrait, dossierText } from "@/lib/portrait";
import { OPTIONAL_TRAITS, PRONOUNS, ROLES } from "@/lib/traits";
import { cn } from "@/lib/utils";

export function CharacterForge() {
  const store = useForge();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [customName, setCustomName] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useForge.persist.onFinishHydration(() => {
      const s = useForge.getState();
      if (s.characters.length === 0) s.create();
      else if (!s.activeId) s.select(s.characters[0].id);
      setHydrated(true);
    });
    if (useForge.persist.hasHydrated()) {
      const s = useForge.getState();
      if (s.characters.length === 0) s.create();
      setHydrated(true);
    }
    return unsub;
  }, []);

  const character = store.active();
  const traits = character ? activeTraits(character) : [];
  const portrait = useMemo(() => {
    if (!character) return null;
    return buildPortrait(character.scores, traits, {
      name: character.name,
      role: character.role,
      pronouns: character.pronouns,
    });
  }, [character, traits]);

  if (!hydrated || !character || !portrait) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
        Opening the ledger…
      </div>
    );
  }

  const live = character;
  const port = portrait;

  const copyDossier = async () => {
    const text = dossierText(port, traits, live.scores);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
  };

  return (
    <main className="forge-shell mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="storyfolk-header">
        <h1 className="text-4xl font-semibold tracking-tight">Storyfolk</h1>
        <p className="mt-1 text-sm text-muted">Shape a character, one trait at a time.</p>
      </header>
      <div className="forge-workspace">
        <aside className="forge-header character-sidebar" aria-label="Character settings">
          <section className="sidebar-actions" aria-label="Character actions">
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="icon"
                aria-label="New character"
                title="New character"
                onClick={() => store.create()}
              >
                <Plus className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Save character"
                title={saved ? "Saved" : "Save character"}
                onClick={() => {
                  store.patch({});
                  setSaved(true);
                  window.setTimeout(() => setSaved(false), 1800);
                }}
              >
                {saved ? <Check className="size-4" /> : <Save className="size-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Duplicate character"
                title="Duplicate character"
                onClick={() => store.duplicate(live.id)}
              >
                <CopyPlus className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Character library"
                title={`Library · ${store.characters.length} characters`}
                aria-expanded={libraryOpen}
                onClick={() => setLibraryOpen(!libraryOpen)}
              >
                <Library className="size-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted" role="status">
              {saved ? "Saved to this browser." : "Automatically saved in this browser."}
            </p>
            {libraryOpen && (
              <div className="mt-4">
                <LibraryList compact />
              </div>
            )}
          </section>
          <section className="sidebar-viz" aria-label="Character visualizations">
            <CognitiveTriangle scores={live.scores} />
            <TraitRadar traits={traits} scores={live.scores} />
          </section>
        </aside>

        <div className="character-workbench">
          <section className="preview-region" aria-label="Character preview">
            <DossierPanel
              portrait={port}
              scores={live.scores}
              onCopy={copyDossier}
              identity={<IdentityForm key={live.id} />}
            />
          </section>

          <section className="mt-6" aria-labelledby="customize-heading">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 id="customize-heading" className="text-lg font-semibold">
                  Customize
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {traits.length} traits · Adjust a scale to update the character.
                </p>
              </div>
              <Button variant="ghost" onClick={() => store.resetScores()}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
            <div className="trait-grid">
              {traits.map((trait) => (
                <TraitScale
                  key={`${live.id}-${trait.id}`}
                  trait={trait}
                  value={live.scores[trait.id] ?? 3}
                  onChange={(n) => store.setScore(trait.id, n)}
                  onRemove={
                    trait.group === "custom"
                      ? () => store.removeCustom(trait.id)
                      : OPTIONAL_TRAITS.some((t) => t.id === trait.id)
                        ? () => store.toggleOptional(trait.id)
                        : undefined
                  }
                  onEditStep={
                    trait.group === "custom"
                      ? (i, text) => store.updateCustomStep(trait.id, i, text)
                      : undefined
                  }
                />
              ))}
            </div>
            <section className="mt-6 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
              <h2 className="font-display text-xl font-semibold text-fg">Catalog</h2>
              <p className="mt-1 text-sm text-muted">
                Optional scales sit in the same 1–5 league. Custom ones let you name whatever the
                story needs.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {OPTIONAL_TRAITS.map((t) => {
                  const on = live.optionalIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => store.toggleOptional(t.id)}
                      className={cn(
                        "h-11 rounded-full px-3 text-sm",
                        on
                          ? "bg-accent text-accent-fg"
                          : "bg-surface-2 text-muted shadow-[var(--shadow-border)] hover:text-fg",
                      )}
                    >
                      {on ? "On · " : "Add · "}
                      {t.name}
                    </button>
                  );
                })}
              </div>
              <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  store.addCustom(customName);
                  setCustomName("");
                }}
              >
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Custom scale name — e.g. Faith, Vanity, Courage"
                  aria-label="Custom scale name"
                />
                <Button type="submit" variant="secondary" className="sm:w-auto">
                  Add scale
                </Button>
              </form>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function IdentityForm() {
  const character = useForge((s) => s.active());
  const patch = useForge((s) => s.patch);
  if (!character) return null;
  return (
    <div className="identity-row">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          className="mt-1.5"
          value={character.name}
          placeholder="Unnamed figure"
          onChange={(e) => patch({ name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="role">Story role</Label>
        <Input
          id="role"
          className="mt-1.5"
          list="story-roles"
          value={character.role}
          onChange={(e) => patch({ role: e.target.value })}
        />
        <datalist id="story-roles">
          {ROLES.map((role) => (
            <option key={role} value={role} />
          ))}
        </datalist>
      </div>
      <div>
        <Label htmlFor="pronouns">Pronouns</Label>
        <select
          id="pronouns"
          className="mt-1.5 h-11 w-full rounded-md border border-border bg-surface-2 px-2 text-sm text-fg"
          value={character.pronouns}
          onChange={(e) => patch({ pronouns: e.target.value })}
        >
          {PRONOUNS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="ghost" className="identity-notes">
            Notes
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="notes-overlay" />
          <Dialog.Content className="notes-modal">
            <Dialog.Title className="text-lg font-semibold">
              Notes for {character.name || "this character"}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-muted">
              Private details, saved automatically in this browser.
            </Dialog.Description>
            <div className="mt-5">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                className="mt-1.5"
                value={character.gender ?? ""}
                placeholder="Optional"
                onChange={(e) => patch({ gender: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="notes">Private notes</Label>
              <Textarea
                id="notes"
                autoFocus
                className="mt-1.5 min-h-48"
                value={character.notes}
                placeholder="Age, occupation, secret, the one thing they want…"
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Dialog.Close asChild>
                <Button variant="secondary">Done</Button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3"
                aria-label="Close notes"
              >
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function LibraryList({ compact }: { compact?: boolean }) {
  const { characters, activeId, select, create, remove } = useForge();

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-fg">
          <Library className="size-4 text-muted" />
          Library
        </h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => create()}>
          <Plus className="size-3.5" />
          New
        </Button>
      </div>
      <ul className={cn("mt-3 space-y-1", compact && "max-h-48 overflow-y-auto")}>
        {characters.map((c) => (
          <li key={c.id} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => select(c.id)}
              className={cn(
                "flex min-h-11 min-w-0 flex-1 items-center justify-between rounded-md px-3 text-left text-sm",
                c.id === activeId ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
              )}
            >
              <span className="truncate">{c.name || "Unnamed figure"}</span>
              <span className="ml-2 shrink-0 text-xs text-subtle">{c.role}</span>
            </button>
            {characters.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${c.name || "figure"}`}
                onClick={() => remove(c.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
