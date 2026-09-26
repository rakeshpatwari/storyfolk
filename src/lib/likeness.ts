import { CORE_TRAITS } from "@/lib/traits";

export interface CanonFigure {
  id: string;
  name: string;
  work: string;
  scores: Record<string, number>;
}

/** Fingerprints on the nine core scales only. Invented readings, not canon stats. */
export const CANON: CanonFigure[] = [
  {
    id: "joker",
    name: "Joker",
    work: "chaos agent",
    scores: {
      perfectionism: 2,
      intellect: 4,
      analytical: 2,
      creativity: 5,
      eccentricity: 5,
      charisma: 5,
      drive: 4,
      coldness: 5,
      selective: 4,
    },
  },
  {
    id: "gus",
    name: "Gus Fring",
    work: "composed operator",
    scores: {
      perfectionism: 5,
      intellect: 5,
      analytical: 5,
      creativity: 3,
      eccentricity: 2,
      charisma: 4,
      drive: 5,
      coldness: 5,
      selective: 5,
    },
  },
  {
    id: "vader",
    name: "Darth Vader",
    work: "fallen enforcer",
    scores: {
      perfectionism: 4,
      intellect: 4,
      analytical: 4,
      creativity: 2,
      eccentricity: 3,
      charisma: 4,
      drive: 5,
      coldness: 4,
      selective: 4,
    },
  },
  {
    id: "spiderman",
    name: "Spider-Man",
    work: "burdened hero",
    scores: {
      perfectionism: 3,
      intellect: 4,
      analytical: 3,
      creativity: 4,
      eccentricity: 3,
      charisma: 4,
      drive: 4,
      coldness: 1,
      selective: 2,
    },
  },
  {
    id: "holmes",
    name: "Sherlock Holmes",
    work: "consulting mind",
    scores: {
      perfectionism: 4,
      intellect: 5,
      analytical: 5,
      creativity: 4,
      eccentricity: 5,
      charisma: 3,
      drive: 5,
      coldness: 4,
      selective: 4,
    },
  },
  {
    id: "lecter",
    name: "Hannibal Lecter",
    work: "aesthetic predator",
    scores: {
      perfectionism: 5,
      intellect: 5,
      analytical: 5,
      creativity: 4,
      eccentricity: 4,
      charisma: 5,
      drive: 4,
      coldness: 5,
      selective: 5,
    },
  },
  {
    id: "stark",
    name: "Tony Stark",
    work: "public genius",
    scores: {
      perfectionism: 3,
      intellect: 5,
      analytical: 4,
      creativity: 5,
      eccentricity: 4,
      charisma: 5,
      drive: 5,
      coldness: 3,
      selective: 3,
    },
  },
  {
    id: "white",
    name: "Walter White",
    work: "pride turned empire",
    scores: {
      perfectionism: 5,
      intellect: 5,
      analytical: 5,
      creativity: 3,
      eccentricity: 2,
      charisma: 3,
      drive: 5,
      coldness: 4,
      selective: 4,
    },
  },
  {
    id: "loki",
    name: "Loki",
    work: "charming betrayer",
    scores: {
      perfectionism: 3,
      intellect: 5,
      analytical: 4,
      creativity: 5,
      eccentricity: 4,
      charisma: 5,
      drive: 4,
      coldness: 4,
      selective: 4,
    },
  },
  {
    id: "wednesday",
    name: "Wednesday Addams",
    work: "deadpan original",
    scores: {
      perfectionism: 5,
      intellect: 4,
      analytical: 4,
      creativity: 3,
      eccentricity: 5,
      charisma: 2,
      drive: 4,
      coldness: 4,
      selective: 4,
    },
  },
  {
    id: "elizabeth",
    name: "Elizabeth Bennet",
    work: "witty observer",
    scores: {
      perfectionism: 3,
      intellect: 4,
      analytical: 3,
      creativity: 4,
      eccentricity: 3,
      charisma: 4,
      drive: 4,
      coldness: 2,
      selective: 2,
    },
  },
  {
    id: "katniss",
    name: "Katniss Everdeen",
    work: "reluctant survivor",
    scores: {
      perfectionism: 3,
      intellect: 3,
      analytical: 3,
      creativity: 3,
      eccentricity: 2,
      charisma: 2,
      drive: 5,
      coldness: 3,
      selective: 4,
    },
  },
  {
    id: "pushpa",
    name: "Pushpa Raj",
    work: "Pushpa · Telugu",
    scores: {
      perfectionism: 2,
      intellect: 4,
      analytical: 4,
      creativity: 4,
      eccentricity: 4,
      charisma: 4,
      drive: 5,
      coldness: 4,
      selective: 5,
    },
  },
  {
    id: "baahubali",
    name: "Amarendra Baahubali",
    work: "Baahubali · Telugu",
    scores: {
      perfectionism: 4,
      intellect: 4,
      analytical: 4,
      creativity: 4,
      eccentricity: 2,
      charisma: 5,
      drive: 5,
      coldness: 1,
      selective: 3,
    },
  },
  {
    id: "bhallaladeva",
    name: "Bhallaladeva",
    work: "Baahubali · Telugu",
    scores: {
      perfectionism: 5,
      intellect: 4,
      analytical: 5,
      creativity: 3,
      eccentricity: 2,
      charisma: 4,
      drive: 5,
      coldness: 5,
      selective: 5,
    },
  },
  {
    id: "bhanumathi",
    name: "Bhanumathi",
    work: "Fidaa · Telugu",
    scores: {
      perfectionism: 3,
      intellect: 4,
      analytical: 3,
      creativity: 4,
      eccentricity: 4,
      charisma: 5,
      drive: 4,
      coldness: 1,
      selective: 4,
    },
  },
  {
    id: "rancho",
    name: "Rancho",
    work: "3 Idiots · Hindi",
    scores: {
      perfectionism: 2,
      intellect: 5,
      analytical: 4,
      creativity: 5,
      eccentricity: 4,
      charisma: 4,
      drive: 5,
      coldness: 1,
      selective: 2,
    },
  },
  {
    id: "geet",
    name: "Geet",
    work: "Jab We Met · Hindi",
    scores: {
      perfectionism: 1,
      intellect: 3,
      analytical: 2,
      creativity: 4,
      eccentricity: 5,
      charisma: 5,
      drive: 4,
      coldness: 1,
      selective: 2,
    },
  },
  {
    id: "gabbar",
    name: "Gabbar Singh",
    work: "Sholay · Hindi",
    scores: {
      perfectionism: 2,
      intellect: 3,
      analytical: 3,
      creativity: 3,
      eccentricity: 5,
      charisma: 4,
      drive: 5,
      coldness: 5,
      selective: 2,
    },
  },
  {
    id: "vidya",
    name: "Vidya Bagchi",
    work: "Kahaani · Hindi",
    scores: {
      perfectionism: 5,
      intellect: 5,
      analytical: 5,
      creativity: 4,
      eccentricity: 2,
      charisma: 3,
      drive: 5,
      coldness: 4,
      selective: 5,
    },
  },
];

export interface Likeness {
  id: string;
  name: string;
  work: string;
  pct: number;
}

const IDS = CORE_TRAITS.map((t) => t.id);
const MAX = Math.sqrt(IDS.length * 16);

export function likenessOf(scores: Record<string, number>, top = 3): Likeness[] {
  return CANON.map((fig) => {
    let sum = 0;
    for (const id of IDS) {
      const d = (scores[id] ?? 3) - (fig.scores[id] ?? 3);
      sum += d * d;
    }
    const pct = Math.round((1 - Math.sqrt(sum) / MAX) * 100);
    return { id: fig.id, name: fig.name, work: fig.work, pct };
  })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, top);
}
