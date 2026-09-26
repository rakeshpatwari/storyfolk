import type { Character } from "@/lib/character-store";
import { likenessOf } from "@/lib/likeness";
import type { Portrait, Scores } from "@/lib/portrait";
import type { TraitDef } from "@/lib/traits";

type PdfInput = {
  character: Character;
  portrait: Portrait;
  traits: TraitDef[];
  scores: Scores;
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
// Inter's variable-font metrics are slightly optimistic in jsPDF. A narrower
// measure keeps long notes inside the page and also improves reading rhythm.
const READING_WIDTH = 145;
const INK = [29, 29, 31] as const;
const MUTED = [96, 96, 103] as const;
const BORDER = [222, 222, 226] as const;
const ACCENT = [0, 102, 204] as const;
const PAPER = [250, 250, 252] as const;

function fileName(name: string) {
  const base = name.trim() || "unnamed-character";
  const slug = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "character"}-storyfolk-dossier.pdf`;
}

async function loadInter() {
  const response = await fetch(`${import.meta.env.BASE_URL}fonts/Inter.ttf`);
  if (!response.ok) throw new Error("Inter font could not be loaded.");
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return window.btoa(binary);
}

export async function exportDossierPdf({ character, portrait, traits, scores }: PdfInput) {
  const [{ jsPDF }, font] = await Promise.all([import("jspdf"), loadInter()]);
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.addFileToVFS("Inter.ttf", font);
  doc.addFont("Inter.ttf", "Inter", "normal");
  doc.setFont("Inter", "normal");

  let y = MARGIN;
  let page = 1;

  const footer = () => {
    doc.setDrawColor(...BORDER);
    doc.line(MARGIN, PAGE_HEIGHT - 14, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 14);
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("STORYFOLK CHARACTER DOSSIER", MARGIN, PAGE_HEIGHT - 8);
    doc.text(String(page).padStart(2, "0"), PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 8, {
      align: "right",
    });
  };

  const newPage = () => {
    footer();
    doc.addPage();
    page += 1;
    y = MARGIN;
    doc.setFillColor(...PAPER);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
  };

  const ensure = (height: number) => {
    if (y + height > PAGE_HEIGHT - 22) newPage();
  };

  const label = (text: string) => {
    ensure(9);
    doc.setFontSize(7.5);
    doc.setTextColor(...ACCENT);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 6;
  };

  const paragraph = (text: string, options?: { size?: number; color?: readonly number[] }) => {
    if (!text.trim()) return;
    const size = options?.size ?? 9.2;
    const lines = doc.splitTextToSize(text, READING_WIDTH) as string[];
    const lineHeight = size * 0.42;
    ensure(lines.length * lineHeight + 3);
    doc.setFontSize(size);
    doc.setTextColor(...((options?.color ?? INK) as [number, number, number]));
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.42 });
    y += lines.length * lineHeight + 3;
  };

  const bullets = (title: string, items: string[]) => {
    if (!items.length) return;
    label(title);
    for (const item of items) {
      const lines = doc.splitTextToSize(item, READING_WIDTH - 7) as string[];
      const height = lines.length * 4 + 2.5;
      ensure(height);
      doc.setFillColor(...ACCENT);
      doc.circle(MARGIN + 1.2, y - 1.1, 0.75, "F");
      doc.setFontSize(8.7);
      doc.setTextColor(...INK);
      doc.text(lines, MARGIN + 6, y, { lineHeightFactor: 1.42 });
      y += height;
    }
    y += 2;
  };

  doc.setFillColor(...PAPER);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  doc.setFontSize(9);
  doc.setTextColor(...ACCENT);
  doc.text("STORYFOLK", MARGIN, y);
  y += 15;

  doc.setFontSize(27);
  doc.setTextColor(...INK);
  const displayName = character.name.trim() || "Unnamed character";
  const titleLines = doc.splitTextToSize(displayName, CONTENT_WIDTH) as string[];
  doc.text(titleLines, MARGIN, y, { lineHeightFactor: 1.02 });
  y += titleLines.length * 11 + 2;

  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  const identity = [character.role, character.pronouns, character.gender].filter(Boolean).join("  /  ");
  doc.text(identity, MARGIN, y);
  y += 8;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.7);
  doc.line(MARGIN, y, MARGIN + 28, y);
  y += 10;

  doc.setFontSize(16);
  doc.setTextColor(...INK);
  const archetypeLines = doc.splitTextToSize(portrait.archetype, CONTENT_WIDTH) as string[];
  doc.text(archetypeLines, MARGIN, y, { lineHeightFactor: 1.18 });
  y += archetypeLines.length * 7.4 + 4;
  paragraph(portrait.portrait, { size: 10.2 });
  paragraph(portrait.intensity, { color: MUTED });
  paragraph(portrait.cognitive);
  y += 4;

  label("Trait profile");
  const columnWidth = (CONTENT_WIDTH - 10) / 2;
  const rowHeight = 11;
  traits.forEach((trait, index) => {
    if (index > 0 && index % 2 === 0) y += rowHeight;
    ensure(rowHeight + 3);
    const column = index % 2;
    const x = MARGIN + column * (columnWidth + 10);
    const value = scores[trait.id] ?? 3;
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text(trait.name, x, y);
    doc.setTextColor(...MUTED);
    doc.text(`${value}/5`, x + columnWidth, y, { align: "right" });
    doc.setFillColor(...BORDER);
    doc.roundedRect(x, y + 2.3, columnWidth, 2.2, 1.1, 1.1, "F");
    doc.setFillColor(...ACCENT);
    doc.roundedRect(x, y + 2.3, (columnWidth * value) / 5, 2.2, 1.1, 1.1, "F");
  });
  if (traits.length % 2 !== 0) y += rowHeight;
  y += 8;

  label("Closest character matches");
  const matches = likenessOf(scores);
  matches.forEach((match) => {
    ensure(8);
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text(match.name, MARGIN, y);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(match.work, MARGIN + 42, y);
    doc.setTextColor(...ACCENT);
    doc.text(`${match.pct}%`, PAGE_WIDTH - MARGIN, y, { align: "right" });
    y += 6;
  });
  y += 5;

  bullets("Behaviors in a scene", portrait.behaviors);
  bullets("Backstory leads", portrait.backstory);
  bullets("Relationships", portrait.relationships);
  bullets("Conflict", portrait.conflicts);
  bullets("Voice", portrait.voice);
  bullets("Scene prompts", portrait.scenes);

  if (character.notes.trim()) {
    label("Writer notes");
    paragraph(character.notes, { size: 9.2 });
  }

  footer();
  doc.setProperties({
    title: `${displayName} - Storyfolk character dossier`,
    subject: portrait.archetype,
    author: "Storyfolk",
    creator: "Storyfolk",
  });
  doc.save(fileName(displayName));
}
