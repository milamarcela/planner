import { beforeEach, describe, expect, it } from "vitest";
import { addClass } from "./schedule";
import {
  addBlock,
  addSection,
  deleteSection,
  getSections,
  getSubjectCards,
  removeBlock,
  updateBlock,
  updateSectionTitle,
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

  it("bloques: agregar, editar, marcar tarea, eliminar y contar imágenes", () => {
    const s = addSection("Química", "#a8d8f0", "Enlaces");
    updateSectionTitle("Química", s.id, "Enlaces químicos");
    addBlock("Química", s.id, "heading");
    addBlock("Química", s.id, "todo");
    addBlock("Química", s.id, "image", "data:image/png;base64,AAA");
    let section = getSections("Química")[0];
    expect(section.title).toBe("Enlaces químicos");
    expect(section.blocks).toHaveLength(3);
    const todo = section.blocks[1];
    updateBlock("Química", s.id, todo.id, { text: "Repasar enlaces iónicos", checked: true });
    section = getSections("Química")[0];
    expect(section.blocks[1].checked).toBe(true);
    expect(getSubjectCards().find((c) => c.subject === "Química")?.imageCount).toBe(1);
    removeBlock("Química", s.id, section.blocks[0].id);
    expect(getSections("Química")[0].blocks).toHaveLength(2);
    deleteSection("Química", s.id);
    expect(getSections("Química")).toHaveLength(0);
  });
});
