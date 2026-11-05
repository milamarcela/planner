export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;
export const WEEK_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];

export interface ClassBlock {
  id: string;
  subject: string;
  day: DayOfWeek;
  start: string;
  end: string;
  room: string;
  teacher: string;
  color: string;
  notes: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  code: string;
  createdAt: number;
  members: string[];
}

export interface StudySession {
  id: string;
  groupId: string | null;
  minutes: number;
  startedAt: number;
  finishedAt: number | null;
}

export const CLASS_COLORS = [
  "#f6a8c0",
  "#cdb4f6",
  "#a8d8f0",
  "#b8e6c8",
  "#ffe3a3",
  "#f9c6a0",
  "#f5a8d0",
  "#a3e8e0",
];
