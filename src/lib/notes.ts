import type { ClassBlock } from "../types";
import { getClasses } from "./schedule";
import { loadJSON, saveJSON, uid } from "./storage";

const KEY = "subjectNotes";

export type BlockType =
  | "heading"
  | "paragraph"
  | "todo"
  | "bullet"
  | "quote"
  | "divider"
  | "image";

export interface NoteBlock {
  id: string;
  type: BlockType;
  text: string;
  checked?: boolean;
  src?: string;
}

export interface NoteSection {
  id: string;
  title: string;
  blocks: NoteBlock[];
  updatedAt: number;
}

interface SubjectNotes {
  color: string;
  sections: NoteSection[];
}

type NotesStore = Record<string, SubjectNotes>;

function getStore(): NotesStore {
  const store = loadJSON<NotesStore>(KEY, {});
  let migrated = false;
  for (const entry of Object.values(store)) {
    for (const s of entry.sections) {
      const legacy = s as unknown as { text?: string; images?: string[] };
      if (!Array.isArray(s.blocks)) {
        const blocks: NoteBlock[] = [];
        if (legacy.text) blocks.push({ id: uid(), type: "paragraph", text: legacy.text });
        for (const img of legacy.images ?? []) blocks.push({ id: uid(), type: "image", text: "", src: img });
        (s as unknown as { blocks: NoteBlock[] }).blocks = blocks;
        migrated = true;
      }
    }
  }
  if (migrated) saveJSON(KEY, store);
  return store;
}

function saveStore(store: NotesStore): void {
  saveJSON(KEY, store);
}

export interface SubjectCard {
  subject: string;
  color: string;
  sectionCount: number;
  imageCount: number;
}

export function getSubjectCards(): SubjectCard[] {
  const store = getStore();
  const bySubject = new Map<string, string>();
  for (const c of getClasses() as ClassBlock[]) {
    if (!bySubject.has(c.subject)) bySubject.set(c.subject, c.color);
  }
  for (const [subject, notes] of Object.entries(store)) {
    if (!bySubject.has(subject)) bySubject.set(subject, notes.color);
  }
  return [...bySubject.entries()]
    .map(([subject, color]) => {
      const sections = store[subject]?.sections ?? [];
      return {
        subject,
        color,
        sectionCount: sections.length,
        imageCount: sections.reduce(
          (acc, s) => acc + s.blocks.filter((b) => b.type === "image").length,
          0,
        ),
      };
    })
    .sort((a, b) => a.subject.localeCompare(b.subject));
}

export function getSections(subject: string): NoteSection[] {
  return getStore()[subject]?.sections ?? [];
}

export function addSection(subject: string, color: string, title: string): NoteSection {
  const store = getStore();
  const entry = store[subject] ?? { color, sections: [] };
  const section: NoteSection = {
    id: uid(),
    title: title.trim() || "Nueva sección",
    blocks: [],
    updatedAt: Date.now(),
  };
  entry.sections.push(section);
  store[subject] = entry;
  saveStore(store);
  return section;
}

export function updateSectionTitle(subject: string, sectionId: string, title: string): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  entry.sections = entry.sections.map((s) =>
    s.id === sectionId ? { ...s, title, updatedAt: Date.now() } : s,
  );
  saveStore(store);
}

export function addBlock(subject: string, sectionId: string, type: BlockType, src?: string): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  const block: NoteBlock = { id: uid(), type, text: "", src };
  entry.sections = entry.sections.map((s) =>
    s.id === sectionId ? { ...s, blocks: [...s.blocks, block], updatedAt: Date.now() } : s,
  );
  saveStore(store);
}

export function updateBlock(
  subject: string,
  sectionId: string,
  blockId: string,
  patch: Partial<Pick<NoteBlock, "text" | "checked">>,
): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  entry.sections = entry.sections.map((s) =>
    s.id === sectionId
      ? {
          ...s,
          blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
          updatedAt: Date.now(),
        }
      : s,
  );
  saveStore(store);
}

export function removeBlock(subject: string, sectionId: string, blockId: string): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  entry.sections = entry.sections.map((s) =>
    s.id === sectionId
      ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId), updatedAt: Date.now() }
      : s,
  );
  saveStore(store);
}

export function deleteSection(subject: string, sectionId: string): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  entry.sections = entry.sections.filter((s) => s.id !== sectionId);
  saveStore(store);
}
