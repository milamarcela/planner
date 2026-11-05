import type { StudySession } from "../types";
import { loadJSON, saveJSON, uid } from "./storage";

const KEY = "sessions";

export function getSessions(): StudySession[] {
  return loadJSON<StudySession[]>(KEY, []);
}

export function startSession(groupId: string | null, minutes: number): StudySession {
  const session: StudySession = {
    id: uid(),
    groupId,
    minutes,
    startedAt: Date.now(),
    finishedAt: null,
  };
  saveJSON(KEY, [...getSessions(), session]);
  return session;
}

export function finishSession(id: string): void {
  saveJSON(
    KEY,
    getSessions().map((s) => (s.id === id ? { ...s, finishedAt: Date.now() } : s)),
  );
}

export function totalFocusMinutes(): number {
  return getSessions()
    .filter((s) => s.finishedAt)
    .reduce((acc, s) => acc + s.minutes, 0);
}
