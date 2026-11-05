import type { StudyGroup } from "../types";
import { loadJSON, saveJSON, uid } from "./storage";

const KEY = "groups";
const MY_NAME_KEY = "myName";

export function getGroups(): StudyGroup[] {
  return loadJSON<StudyGroup[]>(KEY, []);
}

export function saveGroups(groups: StudyGroup[]): void {
  saveJSON(KEY, groups);
}

export function getMyName(): string {
  return loadJSON<string>(MY_NAME_KEY, "");
}

export function setMyName(name: string): void {
  saveJSON(MY_NAME_KEY, name.trim());
}

function makeCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function createGroup(input: {
  name: string;
  subject: string;
  description: string;
  owner: string;
}): StudyGroup | { error: string } {
  const name = input.name.trim();
  const subject = input.subject.trim();
  const owner = input.owner.trim();
  if (!name) return { error: "El grupo necesita un nombre." };
  if (!subject) return { error: "Indica la materia del grupo." };
  if (!owner) return { error: "Escribe tu nombre para unirte como miembro." };
  const groups = getGroups();
  let code = makeCode();
  while (groups.some((g) => g.code === code)) code = makeCode();
  const group: StudyGroup = {
    id: uid(),
    name,
    subject,
    description: input.description.trim(),
    code,
    createdAt: Date.now(),
    members: [owner],
  };
  groups.push(group);
  saveGroups(groups);
  return group;
}

export function joinGroup(codeInput: string, member: string): StudyGroup | { error: string } {
  const code = codeInput.trim().toUpperCase();
  const name = member.trim();
  if (!code) return { error: "Escribe el código del grupo." };
  if (!name) return { error: "Escribe tu nombre para unirte." };
  const groups = getGroups();
  const group = groups.find((g) => g.code === code);
  if (!group) return { error: "No existe ningún grupo con ese código." };
  if (!group.members.includes(name)) {
    group.members.push(name);
    saveGroups(groups);
  }
  return group;
}

export function leaveGroup(id: string, member: string): void {
  const groups = getGroups().map((g) =>
    g.id === id ? { ...g, members: g.members.filter((m) => m !== member) } : g,
  );
  saveGroups(groups);
}

export function deleteGroup(id: string): void {
  saveGroups(getGroups().filter((g) => g.id !== id));
}
