import { WEEK_DAYS } from "../types";
import type { ClassBlock, DayOfWeek } from "../types";
import { loadJSON, saveJSON, uid } from "./storage";

const KEY = "classes";

export function getClasses(): ClassBlock[] {
  return loadJSON<ClassBlock[]>(KEY, []);
}

export function saveClasses(classes: ClassBlock[]): void {
  saveJSON(KEY, classes);
}

export function addClass(data: Omit<ClassBlock, "id">): ClassBlock {
  const classes = getClasses();
  const block: ClassBlock = { ...data, id: uid() };
  classes.push(block);
  saveClasses(classes);
  return block;
}

export function updateClass(id: string, data: Partial<Omit<ClassBlock, "id">>): void {
  saveClasses(getClasses().map((c) => (c.id === id ? { ...c, ...data } : c)));
}

export function deleteClass(id: string): void {
  saveClasses(getClasses().filter((c) => c.id !== id));
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function overlaps(a: Pick<ClassBlock, "day" | "start" | "end">, b: Pick<ClassBlock, "day" | "start" | "end">): boolean {
  if (a.day !== b.day) return false;
  return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

export function findConflict(
  candidate: Pick<ClassBlock, "day" | "start" | "end">,
  excludeId?: string,
): ClassBlock | null {
  return getClasses().find((c) => c.id !== excludeId && overlaps(candidate, c)) ?? null;
}

export function classesForDay(day: DayOfWeek): ClassBlock[] {
  return getClasses()
    .filter((c) => c.day === day)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
}

export function todayClasses(): ClassBlock[] {
  return classesForDay(new Date().getDay() as DayOfWeek);
}

export function isValidRange(start: string, end: string): boolean {
  return /^[0-2]\d:[0-5]\d$/.test(start) && /^[0-2]\d:[0-5]\d$/.test(end) && toMinutes(start) < toMinutes(end);
}

export function weekGrid(): Map<DayOfWeek, ClassBlock[]> {
  const grid = new Map<DayOfWeek, ClassBlock[]>();
  for (const d of WEEK_DAYS) grid.set(d, classesForDay(d));
  return grid;
}
