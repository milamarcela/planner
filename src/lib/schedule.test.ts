import { beforeEach, describe, expect, it } from "vitest";
import { addClass, deleteClass, findConflict, getClasses, overlaps, toMinutes } from "./schedule";

beforeEach(() => localStorage.clear());

describe("toMinutes", () => {
  it("convierte HH:MM a minutos", () => {
    expect(toMinutes("08:30")).toBe(510);
    expect(toMinutes("00:00")).toBe(0);
  });
});

describe("overlaps", () => {
  it("detecta traslape en el mismo día", () => {
    expect(
      overlaps({ day: 1, start: "08:00", end: "10:00" }, { day: 1, start: "09:00", end: "11:00" }),
    ).toBe(true);
  });
  it("no hay traslape en días distintos", () => {
    expect(
      overlaps({ day: 1, start: "08:00", end: "10:00" }, { day: 2, start: "08:00", end: "10:00" }),
    ).toBe(false);
  });
  it("horarios continuos no se traslapan", () => {
    expect(
      overlaps({ day: 3, start: "08:00", end: "10:00" }, { day: 3, start: "10:00", end: "12:00" }),
    ).toBe(false);
  });
});

describe("findConflict", () => {
  it("encuentra conflicto y permite excluir la propia clase al editar", () => {
    const a = addClass({ subject: "Mate", day: 1, start: "08:00", end: "10:00", room: "", teacher: "", color: "#fff", notes: "" });
    expect(findConflict({ day: 1, start: "09:00", end: "11:00" })?.id).toBe(a.id);
    expect(findConflict({ day: 1, start: "08:00", end: "10:00" }, a.id)).toBeNull();
    expect(findConflict({ day: 5, start: "09:00", end: "11:00" })).toBeNull();
  });
});

describe("CRUD de clases", () => {
  it("agrega, lista y elimina", () => {
    const a = addClass({ subject: "Química", day: 2, start: "10:00", end: "12:00", room: "Lab 1", teacher: "", color: "#a8d8f0", notes: "" });
    expect(getClasses()).toHaveLength(1);
    deleteClass(a.id);
    expect(getClasses()).toHaveLength(0);
  });
});
