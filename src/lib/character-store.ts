import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CORE_TRAITS,
  OPTIONAL_TRAITS,
  defaultScores,
  genericSteps,
  type TraitDef,
} from "@/lib/traits";
import { uid } from "@/lib/utils";

export interface Character {
  id: string;
  name: string;
  role: string;
  pronouns: string;
  gender: string;
  notes: string;
  scores: Record<string, number>;
  customTraits: TraitDef[];
  optionalIds: string[];
  updatedAt: number;
}

function blank(): Character {
  return {
    id: uid(),
    name: "",
    role: "Male lead",
    pronouns: "he",
    gender: "",
    notes: "",
    scores: defaultScores(CORE_TRAITS.map((t) => t.id)),
    customTraits: [],
    optionalIds: [],
    updatedAt: Date.now(),
  };
}

export function activeTraits(c: Character): TraitDef[] {
  const optionals = OPTIONAL_TRAITS.filter((t) => c.optionalIds.includes(t.id));
  return [...CORE_TRAITS, ...optionals, ...c.customTraits];
}

interface Store {
  characters: Character[];
  activeId: string | null;
  active: () => Character | undefined;
  create: (partial?: Partial<Character>) => string;
  duplicate: (id: string) => string | undefined;
  remove: (id: string) => void;
  select: (id: string) => void;
  patch: (partial: Partial<Omit<Character, "id">>) => void;
  setScore: (traitId: string, value: number) => void;
  toggleOptional: (traitId: string) => void;
  addCustom: (name: string) => void;
  removeCustom: (traitId: string) => void;
  updateCustomStep: (traitId: string, index: number, text: string) => void;
  resetScores: () => void;
}

const seed = blank();

export const useForge = create<Store>()(
  persist(
    (set, get) => ({
      characters: [seed],
      activeId: seed.id,
      active: () => get().characters.find((c) => c.id === get().activeId),
      create: (partial) => {
        const next = { ...blank(), ...partial, id: uid(), updatedAt: Date.now() };
        set((s) => ({
          characters: [next, ...s.characters],
          activeId: next.id,
        }));
        return next.id;
      },
      duplicate: (id) => {
        const src = get().characters.find((c) => c.id === id);
        if (!src) return;
        const copy: Character = {
          ...src,
          id: uid(),
          name: src.name ? `${src.name} (copy)` : "",
          updatedAt: Date.now(),
          scores: { ...src.scores },
          customTraits: src.customTraits.map((t) => ({
            ...t,
            steps: [...t.steps] as TraitDef["steps"],
          })),
          optionalIds: [...src.optionalIds],
        };
        set((s) => ({ characters: [copy, ...s.characters], activeId: copy.id }));
        return copy.id;
      },
      remove: (id) => {
        set((s) => {
          const characters = s.characters.filter((c) => c.id !== id);
          const activeId =
            s.activeId === id ? (characters[0]?.id ?? null) : s.activeId;
          return { characters, activeId };
        });
      },
      select: (id) => set({ activeId: id }),
      patch: (partial) => {
        const id = get().activeId;
        if (!id) return;
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, ...partial, updatedAt: Date.now() } : c,
          ),
        }));
      },
      setScore: (traitId, value) => {
        const id = get().activeId;
        if (!id) return;
        const clamped = Math.min(5, Math.max(1, Math.round(value)));
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  scores: { ...c.scores, [traitId]: clamped },
                  updatedAt: Date.now(),
                }
              : c,
          ),
        }));
      },
      toggleOptional: (traitId) => {
        const id = get().activeId;
        if (!id) return;
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== id) return c;
            const on = c.optionalIds.includes(traitId);
            const optionalIds = on
              ? c.optionalIds.filter((x) => x !== traitId)
              : [...c.optionalIds, traitId];
            const scores = { ...c.scores };
            if (!on && scores[traitId] == null) scores[traitId] = 3;
            return { ...c, optionalIds, scores, updatedAt: Date.now() };
          }),
        }));
      },
      addCustom: (name) => {
        const id = get().activeId;
        if (!id) return;
        const trimmed = name.trim();
        if (!trimmed) return;
        const trait: TraitDef = {
          id: `custom-${uid()}`,
          name: trimmed,
          short: "A scale you added for this figure.",
          group: "custom",
          steps: genericSteps(trimmed),
        };
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  customTraits: [...c.customTraits, trait],
                  scores: { ...c.scores, [trait.id]: 3 },
                  updatedAt: Date.now(),
                }
              : c,
          ),
        }));
      },
      removeCustom: (traitId) => {
        const id = get().activeId;
        if (!id) return;
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== id) return c;
            const { [traitId]: _removed, ...scores } = c.scores;
            return {
              ...c,
              customTraits: c.customTraits.filter((t) => t.id !== traitId),
              scores,
              updatedAt: Date.now(),
            };
          }),
        }));
      },
      updateCustomStep: (traitId, index, text) => {
        const id = get().activeId;
        if (!id) return;
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== id) return c;
            return {
              ...c,
              customTraits: c.customTraits.map((t) => {
                if (t.id !== traitId) return t;
                const steps = [...t.steps] as TraitDef["steps"];
                steps[index] = text;
                return { ...t, steps };
              }),
              updatedAt: Date.now(),
            };
          }),
        }));
      },
      resetScores: () => {
        const id = get().activeId;
        if (!id) return;
        const c = get().characters.find((x) => x.id === id);
        if (!c) return;
        const scores = defaultScores(activeTraits(c).map((t) => t.id));
        set((s) => ({
          characters: s.characters.map((ch) =>
            ch.id === id ? { ...ch, scores, updatedAt: Date.now() } : ch,
          ),
        }));
      },
    }),
    {
      name: "aria-forge.v1",
      partialize: (s) => ({
        characters: s.characters,
        activeId: s.activeId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.characters.length === 0) {
          const first = blank();
          state.characters = [first];
          state.activeId = first.id;
        } else if (
          !state.activeId ||
          !state.characters.some((c) => c.id === state.activeId)
        ) {
          state.activeId = state.characters[0].id;
        }
      },
    },
  ),
);
