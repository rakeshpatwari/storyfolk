export type TraitGroup = "cognitive" | "social" | "drive" | "affect" | "custom";

export interface TraitDef {
  id: string;
  name: string;
  short: string;
  group: TraitGroup;
  steps: [string, string, string, string, string];
}

export const CORE_TRAITS: TraitDef[] = [
  {
    id: "perfectionism",
    name: "Perfectionism",
    short: "How they treat flaws, drafts, and work that is merely good enough.",
    group: "drive",
    steps: [
      "Casual. Accepts good enough, improvises, and can live with visible flaws.",
      "Prefers high standards but can let go when time, people, or the scene demands it.",
      "Strong drive for excellence. Mediocrity visibly irritates them.",
      "Near-obsessive. Revises repeatedly, micromanages details, struggles to ship imperfect work.",
      "Pathological. Cannot tolerate flaws in self or others; paralyzes projects or becomes cruelly critical.",
    ],
  },
  {
    id: "intellect",
    name: "Intellect",
    short: "How quickly they grasp ideas and how far they follow them.",
    group: "cognitive",
    steps: [
      "Average or below. Complex or abstract ideas are a struggle.",
      "Solid everyday intelligence. Keeps up, rarely leads the room intellectually.",
      "Clearly above average. Grasps complicated concepts quickly.",
      "Exceptional. Operates several steps ahead of most people in the scene.",
      "Genius-level. Sees patterns and implications others miss entirely.",
    ],
  },
  {
    id: "analytical",
    name: "Analytical rigor",
    short: "How they process: systematic dissection vs. gut.",
    group: "cognitive",
    steps: [
      "Highly intuitive or impulsive. Little systematic thinking.",
      "Mix of gut and logic. Plans when it matters, otherwise wings it.",
      "Prefers logic and structure but can switch into intuition.",
      "Strongly systematic. Breaks everything into parts and tests assumptions.",
      "Hyper-analytical. Almost always dissects situations coldly and thoroughly.",
    ],
  },
  {
    id: "creativity",
    name: "Creativity",
    short: "How often they invent new frames, solutions, or images.",
    group: "cognitive",
    steps: [
      "Conventional. Follows established methods and existing scripts.",
      "Occasional original ideas. Mostly remixes what already works.",
      "Regularly generates novel solutions or perspectives.",
      "Highly inventive. Frequently redefines the problem itself.",
      "Visionary. Ideas often feel alien, ahead of their time, or slightly unhinged.",
    ],
  },
  {
    id: "eccentricity",
    name: "Eccentricity",
    short: "How far their habits and worldview sit from the room.",
    group: "social",
    steps: [
      "Socially conventional. Blends in easily.",
      "Mild quirks that read as endearing or go unnoticed.",
      "Noticeably odd in habits, speech, or interests, still functional.",
      "Markedly eccentric. People comment, stare, or feel unsettled.",
      "Extreme. Routines and worldview feel alien to almost everyone.",
    ],
  },
  {
    id: "charisma",
    name: "Charisma",
    short: "How strongly their presence pulls people in.",
    group: "social",
    steps: [
      "Flat or actively off-putting. Rooms cool when they enter.",
      "Neutral. Neither draws nor repels people strongly.",
      "Likeable and engaging in ordinary social settings.",
      "Strongly magnetic. People want their attention and approval.",
      "Overwhelming presence. Can dominate a room and inspire loyalty or fascination even when cold.",
    ],
  },
  {
    id: "drive",
    name: "Self-motivation",
    short: "How much fire comes from inside vs. from others.",
    group: "drive",
    steps: [
      "Needs external pressure. Drifts without a deadline or a handler.",
      "Moderately self-directed if some structure is already there.",
      "Internally driven. Sets and pursues goals without much fuss.",
      "Highly autonomous and relentless. Rarely needs an external push.",
      "Obsessive internal fire. Pursues goals regardless of cost, rest, or feedback.",
    ],
  },
  {
    id: "coldness",
    name: "Psychopathic traits",
    short: "A fictional empathy, fear, and remorse spectrum. This isn't a diagnosis.",
    group: "affect",
    steps: [
      "Highly empathic. Strongly affected by other people's feelings and pain.",
      "Normally empathic, with occasional useful detachment.",
      "Selective or controlled empathy. Can switch it off when useful.",
      "Markedly low empathy and emotional reactivity. Calculates more than feels.",
      "Extreme coldness. Little genuine remorse or attachment; people read as instruments or obstacles. Superficial charm is possible.",
    ],
  },
  {
    id: "selective",
    name: "Selective emotionality",
    short: "Whether feeling is broad, gated, or locked in one vault.",
    group: "affect",
    steps: [
      "Broad, open emotional range. Feels and shows readily across situations.",
      "Mostly open, with a few private or guarded rooms.",
      "Emotions are present but filtered. Shown mainly to trusted people or in private.",
      "Highly selective. Intense feeling exists, tightly compartmentalized, rarely visible.",
      "Extreme compartmentalization. Appears nearly emotionless in most contexts, capable of profound or obsessive feeling in a very narrow domain.",
    ],
  },
];

export const OPTIONAL_TRAITS: TraitDef[] = [
  {
    id: "ambition",
    name: "Ambition",
    short: "Scale of the life they are trying to seize.",
    group: "drive",
    steps: [
      "Content with a small orbit. Status and legacy barely register.",
      "Wants a good life, not a throne.",
      "Clearly wants greater rank, mastery, love, or power, and will work for it.",
      "Hungry. Measures the room by who is above them.",
      "All-consuming. Will burn bridges, rest, and sometimes people to climb.",
    ],
  },
  {
    id: "loyalty",
    name: "Loyalty capacity",
    short: "How sticky their bonds are once given.",
    group: "social",
    steps: [
      "Bonds are transactional and easily dropped.",
      "Loyal while convenient. Will leave if the cost rises.",
      "Genuinely loyal to a small circle, with limits.",
      "Deeply loyal. Betrayal of their people is almost unthinkable.",
      "Absolute. Will follow a person or cause into ruin.",
    ],
  },
  {
    id: "moral",
    name: "Moral flexibility",
    short: "How far they will bend a rule to get a result.",
    group: "affect",
    steps: [
      "Rigid code. Will lose rather than cross their line.",
      "Mostly principled, with rare exceptions they regret.",
      "Pragmatic. Rules are real but not sacred.",
      "Flexible. Ends routinely justify uncomfortable means.",
      "Amoral toolkit. Ethics are costumes for the room they are in.",
    ],
  },
  {
    id: "resilience",
    name: "Resilience",
    short: "How they metabolize failure, grief, and pressure.",
    group: "drive",
    steps: [
      "Brittle. Setbacks unmake them for a long time.",
      "Recovers, but slowly, and with visible scars.",
      "Bounces back in a normal human rhythm.",
      "Hard to keep down. Uses pain as fuel more often than not.",
      "Almost unbreakable. Numbness may delay the collapse rather than prevent it.",
    ],
  },
  {
    id: "humor",
    name: "Humor",
    short: "Whether wit is a weapon, a shield, or missing.",
    group: "social",
    steps: [
      "Humorless, or jokes that land as insults.",
      "Dry or rare. A smile is an event.",
      "Easy, situational humor. Relieves tension without stealing scenes.",
      "Sharp. Wit is a social tool and a tell.",
      "Relentless. Deflects, dominates, or hides behind the joke.",
    ],
  },
  {
    id: "possessiveness",
    name: "Possessiveness",
    short: "How they hold people, work, and territory.",
    group: "affect",
    steps: [
      "Easy with sharing. Attachment without grip.",
      "Prefers their people close, without policing them.",
      "Noticeable claim. Jealousy flickers under stress.",
      "Guarding. Tracks attention, access, and rivals.",
      "Consuming. Love and ownership blur; loss feels like theft.",
    ],
  },
];

export const GROUP_LABEL: Record<TraitGroup, string> = {
  cognitive: "Cognitive",
  social: "Social presence",
  drive: "Drive",
  affect: "Affect",
  custom: "Custom",
};

export const COGNITIVE_IDS = ["intellect", "analytical", "creativity"] as const;

export const ROLES = [
  "Male lead",
  "Female lead",
  "POV character",
  "Love interest",
  "Antagonist",
  "Rival",
  "Mentor",
  "Sidekick",
  "Ensemble",
  "Narrator",
  "Other",
] as const;

export const PRONOUNS = [
  { id: "they", label: "they / them", subj: "they", obj: "them", poss: "their", verb: "are", self: "themselves" },
  { id: "he", label: "he / him", subj: "he", obj: "him", poss: "his", verb: "is", self: "himself" },
  { id: "she", label: "she / her", subj: "she", obj: "her", poss: "her", verb: "is", self: "herself" },
] as const;

export type PronounId = (typeof PRONOUNS)[number]["id"];

export function pronounSet(id: string) {
  return PRONOUNS.find((p) => p.id === id) ?? PRONOUNS[0];
}

export function catalogTrait(id: string): TraitDef | undefined {
  return CORE_TRAITS.find((t) => t.id === id) ?? OPTIONAL_TRAITS.find((t) => t.id === id);
}

export function defaultScores(traitIds: string[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const id of traitIds) scores[id] = 3;
  return scores;
}

export function genericSteps(name: string): [string, string, string, string, string] {
  const n = name.toLowerCase();
  return [
    `Barely present. ${n} almost never shapes a scene.`,
    `Mild. ${n} shows in small habits, not in plot turns.`,
    `Noticeable. Other characters would name this if asked.`,
    `Strong. ${n} regularly drives choices and friction.`,
    `Defining. This is one of the first things the story is about.`,
  ];
}
