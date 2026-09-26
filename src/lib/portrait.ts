import {
  catalogTrait,
  COGNITIVE_IDS,
  pronounSet,
  type TraitDef,
} from "@/lib/traits";

export type Scores = Record<string, number>;

export interface Portrait {
  name: string;
  role: string;
  archetype: string;
  oneLiner: string;
  intensity: string;
  cognitive: string;
  portrait: string;
  behaviors: string[];
  backstory: string[];
  relationships: string[];
  conflicts: string[];
  voice: string[];
  scenes: string[];
  peaks: { id: string; name: string; score: number }[];
  valleys: { id: string; name: string; score: number }[];
  mean: number;
  spread: number;
}

function s(scores: Scores, id: string, fallback = 3) {
  const v = scores[id];
  return typeof v === "number" ? v : fallback;
}

function nameOf(id: string, custom: TraitDef[]) {
  return catalogTrait(id)?.name ?? custom.find((t) => t.id === id)?.name ?? id;
}

export function meanOf(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function spreadOf(values: number[]) {
  if (values.length < 2) return 0;
  const m = meanOf(values);
  const v = meanOf(values.map((x) => (x - m) ** 2));
  return Math.sqrt(v);
}

function pickArchetype(sc: Scores, p: ReturnType<typeof pronounSet>) {
  const intel = s(sc, "intellect");
  const anal = s(sc, "analytical");
  const crea = s(sc, "creativity");
  const charisma = s(sc, "charisma");
  const cold = s(sc, "coldness");
  const sel = s(sc, "selective");
  const drive = s(sc, "drive");
  const perf = s(sc, "perfectionism");
  const ecc = s(sc, "eccentricity");
  const amb = s(sc, "ambition", 0);
  const moral = s(sc, "moral", 0);

  if (cold >= 4 && charisma >= 4 && sel >= 4)
    return `The vaulted magnet — charm on the surface, feeling locked to one domain`;
  if (intel >= 4 && anal >= 4 && crea <= 2)
    return `The cold strategist — high horsepower, low invention, lethal at systems`;
  if (intel >= 4 && crea >= 4 && anal <= 2)
    return `The visionary eccentric — sees the new world, hates the spreadsheet`;
  if (intel >= 4 && crea >= 4 && anal >= 4)
    return `The complete mind — rare cognitive triangle at full tension`;
  if (perf >= 4 && drive >= 4)
    return `The relentless artisan — will not stop, will not ship dirty`;
  if (ecc >= 4 && crea >= 4)
    return `The untranslated genius — brilliant in a dialect almost nobody speaks`;
  if (charisma <= 2 && intel >= 4)
    return `The isolated intellect — the room does not love ${p.obj}; the work might`;
  if (charisma >= 4 && drive >= 4 && cold <= 2)
    return `The warm engine — pulls people along on genuine heat`;
  if (moral >= 4 && amb >= 4)
    return `The climber with no banister — hungry and unfenced`;
  if (cold >= 4 && charisma <= 2)
    return `The winter blade — low warmth, low performance, high cut`;
  if (sel >= 4 && cold <= 2)
    return `The private storm — feels everything, shows almost none of it`;
  if (drive <= 2 && intel >= 4)
    return `The unused instrument — the mind is there; the fire is not`;
  return `The forming figure — push two traits to the edges to lock an archetype`;
}

export function buildPortrait(
  scores: Scores,
  traits: TraitDef[],
  meta: { name: string; role: string; pronouns: string },
): Portrait {
  const p = pronounSet(meta.pronouns);
  const display = meta.name.trim() || "This character";
  const role = meta.role || "unspecified role";
  const ranked = traits
    .map((t) => ({ id: t.id, name: t.name, score: s(scores, t.id) }))
    .sort((a, b) => b.score - a.score);
  const peaks = ranked.filter((x) => x.score >= 4).slice(0, 3);
  const valleys = [...ranked].reverse().filter((x) => x.score <= 2).slice(0, 3);
  const values = traits.map((t) => s(scores, t.id));
  const mean = meanOf(values);
  const spread = spreadOf(values);

  const intel = s(scores, "intellect");
  const anal = s(scores, "analytical");
  const crea = s(scores, "creativity");
  const charisma = s(scores, "charisma");
  const cold = s(scores, "coldness");
  const sel = s(scores, "selective");
  const drive = s(scores, "drive");
  const perf = s(scores, "perfectionism");
  const ecc = s(scores, "eccentricity");

  const archetype = pickArchetype(scores, p);

  const cogBits: string[] = [];
  if (intel >= anal && intel >= crea) cogBits.push("leads with raw intellect");
  if (anal > intel && anal >= crea) cogBits.push("leads with dissection");
  if (crea > intel && crea > anal) cogBits.push("leads with invention");
  if (Math.abs(intel - anal) <= 1 && Math.abs(anal - crea) <= 1)
    cogBits.push("the three cognitive legs are nearly even — a balanced, less spiky mind");
  else if (intel >= 4 && anal >= 4 && crea <= 2)
    cogBits.push("classic cold triangle: horsepower + rigor, thin originality");
  else if (intel >= 4 && crea >= 4 && anal <= 2)
    cogBits.push("visionary triangle: horsepower + novelty, thin method");
  else if (anal >= 4 && crea >= 4 && intel <= 2)
    cogBits.push("craftsman’s triangle: method + invention without towering IQ — still dangerous in a niche");

  const intensity =
    spread >= 1.35
      ? `High-contrast profile (spread ${spread.toFixed(1)}). Contradictions will carry scenes — lean into the clash between peaks and valleys.`
      : mean >= 4
        ? `Hot profile (mean ${mean.toFixed(1)}). Almost everything is turned up; give ${p.obj} one human incompetence so the reader can breathe.`
        : mean <= 2.4
          ? `Quiet profile (mean ${mean.toFixed(1)}). Either a still-water character or one who has not been specified yet — raise two traits if you want plot torque.`
          : `Moderated profile (mean ${mean.toFixed(1)}, spread ${spread.toFixed(1)}). Believable, but a little safe. Push one peak and one valley to make ${p.obj} memorable.`;

  const oneLiner = `${display} (${role}) — ${archetype.toLowerCase()}.`;

  const portraitParts: string[] = [];
  portraitParts.push(
    `${display} ${p.verb} built to be read at a glance as ${archetype.split("—")[0].trim().toLowerCase()}, then complicated on the second look.`,
  );
  if (charisma >= 4 && cold >= 4) {
    portraitParts.push(
      `${p.subj[0].toUpperCase()}${p.subj.slice(1)} can fill a doorway without raising ${p.poss} voice. People lean in; they should not mistake that for care.`,
    );
  } else if (charisma >= 4) {
    portraitParts.push(`Presence does work ${p.subj} does not have to. Approval is a currency ${p.subj} ${p.verb === "are" ? "spend" : "spends"} carefully.`);
  } else if (charisma <= 2 && intel >= 4) {
    portraitParts.push(
      `Social gravity is weak. ${p.subj[0].toUpperCase()}${p.subj.slice(1)} ${p.verb} often underestimated until the argument is already lost.`,
    );
  }
  if (sel >= 4) {
    portraitParts.push(
      `Feeling is not absent — it is rationed. The reader should see weather only in the one room ${p.subj} ${p.verb === "are" ? "have" : "has"} not locked.`,
    );
  } else if (sel <= 2 && cold <= 2) {
    portraitParts.push(`Emotion leaks. Scenes will know how ${p.subj} ${p.verb} doing whether ${p.subj} ${p.verb === "are" ? "want" : "wants"} that or not.`);
  }
  if (perf >= 4) {
    portraitParts.push(
      `Flaw is an insult. Drafts, people, and plans get sanded until something — or someone — snaps.`,
    );
  }
  if (ecc >= 4) {
    portraitParts.push(
      `The body has tells: odd timing, private rituals, a worldview that will not translate in small talk.`,
    );
  }
  if (drive >= 5) {
    portraitParts.push(`Rest looks like failure. The plot does not need to chase ${p.obj}; ${p.subj} ${p.verb === "are" ? "generate" : "generates"} motion.`);
  } else if (drive <= 2) {
    portraitParts.push(`Without an external engine, ${p.subj} stalls. A handler, a deadline, or a threat may have to do the driving.`);
  }

  const behaviors: string[] = [];
  if (anal >= 4) behaviors.push(`Rewrites a crisis as a diagram before ${p.subj} ${p.verb === "are" ? "move" : "moves"}.`);
  if (crea >= 4) behaviors.push(`Solves sideways — changes the question instead of answering it.`);
  if (perf >= 4) behaviors.push(`Cannot leave a crooked picture, a sloppy sentence, or a half-done plan.`);
  if (cold >= 4) behaviors.push(`Names other people’s pain accurately and does not pick it up.`);
  if (sel >= 4) behaviors.push(`Goes still when others would cry, shout, or reach. The tell is absence.`);
  if (charisma >= 4) behaviors.push(`Holds eye contact a beat too long; people fill the silence with loyalty.`);
  if (ecc >= 4) behaviors.push(`Keeps a private system — hours, food, objects, words — that others treat as a joke until it isn’t.`);
  if (drive >= 4) behaviors.push(`Shows up early, stays late, forgets to eat, treats sleep as optional.`);
  if (s(scores, "humor") >= 4) behaviors.push(`Uses the joke as a blade or a door. Watch who is allowed to laugh with ${p.obj}.`);
  if (s(scores, "loyalty") >= 4) behaviors.push(`Will take a wound for a named few and shrug at the rest of the world.`);
  if (s(scores, "possessiveness") >= 4) behaviors.push(`Tracks who looked at whom. Access is love.`);
  if (s(scores, "moral") >= 4) behaviors.push(`Crosses lines in private, then writes a cleaner story of the crossing.`);
  if (behaviors.length < 3) {
    behaviors.push(`Default mode: ${nameOf(ranked[0].id, traits)} at ${ranked[0].score}/5 leaks into ordinary tasks.`);
    if (valleys[0]) behaviors.push(`Avoids or fails at anything that needs ${valleys[0].name.toLowerCase()}.`);
  }

  const backstory: string[] = [];
  if (perf >= 4 && cold >= 3)
    backstory.push(`A childhood where love was graded. Excellence was safety; a B-minus was weather turning.`);
  if (intel >= 4 && charisma <= 2)
    backstory.push(`Skipped a social grade. Learned to win rooms on the page, not in the hallway.`);
  if (sel >= 4)
    backstory.push(`Something was too large to feel in public — grief, guilt, or a forbidden attachment — so ${p.subj} built walls with doors only ${p.subj} can find.`);
  if (ecc >= 4)
    backstory.push(`Grew up slightly out of phase with the local culture. The eccentricity is a native language, not a costume.`);
  if (drive >= 4 && s(scores, "ambition") >= 4)
    backstory.push(`Saw a ceiling early — class, city, family — and decided the only moral failure was staying under it.`);
  if (cold >= 4)
    backstory.push(`Either never wired for easy empathy, or had it trained out by a job, a war, a house that punished softness.`);
  if (crea >= 4 && anal <= 2)
    backstory.push(`Rewarded for sparks, never for finishing. Method feels like a cage ${p.subj} ${p.verb === "are" ? "still" : "still"} refuses.`);
  if (backstory.length === 0)
    backstory.push(`Let the highest trait be a scar, not a gift: who taught ${p.obj} to be this way, and what did it cost?`);
  backstory.push(`Give one ordinary loyalty (a sibling, a teacher, a street, a craft) so the extremes have somewhere to land.`);

  const relationships: string[] = [];
  if (charisma >= 4 && cold >= 4)
    relationships.push(`Partners and allies feel chosen and slightly hunted. Intimacy is a project with a success metric.`);
  else if (charisma >= 4)
    relationships.push(`People arrive already half in love with the idea of ${p.obj}. The work is surviving the real person.`);
  if (sel >= 4)
    relationships.push(`Only one or two people get the unlatched version. Everyone else meets the door.`);
  if (perf >= 4)
    relationships.push(`Loved ones are edited. Kindness can look like a mark-up.`);
  if (s(scores, "loyalty") >= 4)
    relationships.push(`Once in, they do not leave. The danger is who gets to be ‘in’.`);
  if (s(scores, "possessiveness") >= 4)
    relationships.push(`Romance and rivalry will rhyme. Attention is a scarce resource ${p.subj} ${p.verb === "are" ? "ration" : "rations"}.`);
  if (cold <= 2 && charisma >= 3)
    relationships.push(`Easy to trust, easy to bruise. Other characters will use that, or protect it.`);
  if (relationships.length === 0)
    relationships.push(`Match ${p.obj} with someone who scores opposite on the peak trait — friction without a villain speech.`);

  const conflicts: string[] = [];
  if (perf >= 4 && drive >= 4)
    conflicts.push(`Internal: the work is never done, so the life is never allowed to start.`);
  if (cold >= 4 && sel >= 4)
    conflicts.push(`Internal: the one thing ${p.subj} ${p.verb === "are" ? "cannot" : "cannot"} freeze will be the plot’s lever.`);
  if (intel >= 4 && crea >= 4 && anal <= 2)
    conflicts.push(`External: institutions that demand proof, process, and patience — all of which bore or offend ${p.obj}.`);
  if (charisma >= 4)
    conflicts.push(`External: a crowd, a court, or a company that wants the performance more than the person.`);
  if (s(scores, "moral") >= 4)
    conflicts.push(`A line ${p.subj} already crossed, and a witness who will not stay quiet.`);
  if (spread >= 1.3)
    conflicts.push(`The character vs. ${p.self}: peaks and valleys want different endings. Let both almost win.`);
  if (conflicts.length < 2)
    conflicts.push(`Put ${p.obj} in a scene that can only be solved by the valley trait — the thing ${p.subj} ${p.verb === "are" ? "are" : "is"} worst at.`);

  const voice: string[] = [];
  if (anal >= 4) voice.push(`Precise nouns, few adjectives, arguments in numbered beats even when speaking.`);
  if (crea >= 4 && anal <= 3) voice.push(`Metaphor first. Jumps tracks. Leaves the listener to catch up.`);
  if (cold >= 4) voice.push(`Affect is thin. Empathy, when it appears, is technically correct and slightly late.`);
  if (charisma >= 4) voice.push(`Pacing control: pauses, names, the sense that the line was meant for you.`);
  if (ecc >= 4) voice.push(`Private vocabulary, odd examples, humor that does not ask permission.`);
  if (sel >= 4) voice.push(`Long stretches of control, then a sentence that is too true.`);
  if (voice.length === 0) voice.push(`Keep diction close to the peak trait. Let the valley trait show as hesitation, not as a speech.`);

  const scenes: string[] = [];
  scenes.push(`Open on a task that reveals the peak (${peaks[0] ? peaks[0].name : "highest trait"}) without a monologue.`);
  if (valleys[0])
    scenes.push(`Midpoint test: a problem that can only be solved with ${valleys[0].name.toLowerCase()}. Watch ${p.obj} refuse, cheat, or break.`);
  if (COGNITIVE_IDS.every((id) => traits.some((t) => t.id === id)))
    scenes.push(
      `A planning scene is a cognitive x-ray: intellect finds the pattern, analysis stress-tests it, creativity offers the illegal third option.`,
    );
  if (sel >= 4)
    scenes.push(`Give the reader one private room — a letter, a body, a grave, a piece of music — where the scale on selective emotionality pays off.`);
  scenes.push(`End a chapter on a choice that is consistent with the scales and still costs ${p.obj} something ${p.subj} ${p.verb === "are" ? "want" : "wants"}.`);

  return {
    name: display,
    role,
    archetype,
    oneLiner,
    intensity,
    cognitive: cogBits.join(" ") || "Adjust intellect, analytical rigor, and creativity to shape the triangle.",
    portrait: portraitParts.join(" "),
    behaviors: behaviors.slice(0, 6),
    backstory: backstory.slice(0, 4),
    relationships: relationships.slice(0, 4),
    conflicts: conflicts.slice(0, 4),
    voice: voice.slice(0, 4),
    scenes: scenes.slice(0, 5),
    peaks,
    valleys,
    mean,
    spread,
  };
}

export function dossierText(port: Portrait, traits: TraitDef[], scores: Scores) {
  const lines = [
    port.name,
    `${port.role} — ${port.archetype}`,
    "",
    port.portrait,
    "",
    "Scales",
    ...traits.map((t) => `• ${t.name}: ${s(scores, t.id)}/5 — ${t.steps[s(scores, t.id) - 1]}`),
    "",
    "Cognitive triangle",
    port.cognitive,
    "",
    "Behaviors",
    ...port.behaviors.map((x) => `• ${x}`),
    "",
    "Backstory seeds",
    ...port.backstory.map((x) => `• ${x}`),
    "",
    "Relationships",
    ...port.relationships.map((x) => `• ${x}`),
    "",
    "Conflict",
    ...port.conflicts.map((x) => `• ${x}`),
    "",
    "Voice",
    ...port.voice.map((x) => `• ${x}`),
    "",
    "Scene uses",
    ...port.scenes.map((x) => `• ${x}`),
  ];
  return lines.join("\n");
}
