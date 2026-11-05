import type { ClassBlock } from "../types";
import { getClasses } from "./schedule";
import { loadJSON, saveJSON, uid } from "./storage";

const KEY = "subjectNotes";

export interface NoteSection {
  id: string;
  title: string;
  text: string;
  images: string[];
  updatedAt: number;
}

interface SubjectNotes {
  color: string;
  sections: NoteSection[];
}

type NotesStore = Record<string, SubjectNotes>;

function getStore(): NotesStore {
  return loadJSON<NotesStore>(KEY, {});
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
        imageCount: sections.reduce((acc, s) => acc + s.images.length, 0),
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
    text: "",
    images: [],
    updatedAt: Date.now(),
  };
  entry.sections.push(section);
  store[subject] = entry;
  saveStore(store);
  return section;
}

export function updateSection(
  subject: string,
  sectionId: string,
  patch: Partial<Pick<NoteSection, "title" | "text">>,
): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  entry.sections = entry.sections.map((s) =>
    s.id === sectionId ? { ...s, ...patch, updatedAt: Date.now() } : s,
  );
  saveStore(store);
}

export function addImage(subject: string, sectionId: string, dataUrl: string): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  entry.sections = entry.sections.map((s) =>
    s.id === sectionId
      ? { ...s, images: [...s.images, dataUrl], updatedAt: Date.now() }
      : s,
  );
  saveStore(store);
}

export function removeImage(subject: string, sectionId: string, index: number): void {
  const store = getStore();
  const entry = store[subject];
  if (!entry) return;
  entry.sections = entry.sections.map((s) =>
    s.id === sectionId
      ? { ...s, images: s.images.filter((_, i) => i !== index), updatedAt: Date.now() }
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
