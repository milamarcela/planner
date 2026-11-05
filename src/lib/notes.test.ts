import { beforeEach, describe, expect, it } from "vitest";
import { addClass } from "./schedule";
import {
  addImage,
  addSection,
  deleteSection,
  getSections,
  getSubjectCards,
  removeImage,
  updateSection,
} from "./notes";

beforeEach(() => localStorage.clear());

describe("notebook de materias", () => {
  it("lista materias desde las clases y cuenta secciones", () => {
    addClass({ subject: "Cálculo", day: 1, start: "08:00", end: "10:00", room: "", teacher: "", color: "#f6a8c0", notes: "" });
    addClass({ subject: "Química", day: 2, start: "10:00", end: "12:00", room: "", teacher: "", color: "#a8d8f0", notes: "" });
    let cards = getSubjectCards();
    expect(cards.map((c) => c.subject).sort()).toEqual(["Cálculo", "Química"]);
    addSection("Cálculo", "#f6a8c0", "Unidad 1");
    cards = getSubjectCards();
    expect(cards.find((c) => c.subject === "Cálculo")?.sectionCount).toBe(1);
  });

  it("CRUD de secciones e imágenes", () => {
    const s = addSection("Química", "#a8d8f0", "Enlaces");
    updateSection("Química", s.id, { text: "Repasar enlaces iónicos" });
    addImage("Química", s.id, "data:image/png;base64,AAA");
    addImage("Química", s.id, "data:image/png;base64,BBB");
    let sections = getSections("Química");
    expect(sections[0].text).toContain("iónicos");
    expect(sections[0].images).toHaveLength(2);
    removeImage("Química", s.id, 0);
    sections = getSections("Química");
    expect(sections[0].images).toEqual(["data:image/png;base64,BBB"]);
    deleteSection("Química", s.id);
    expect(getSections("Química")).toHaveLength(0);
  });
});
