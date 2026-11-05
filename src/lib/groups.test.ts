import { beforeEach, describe, expect, it } from "vitest";
import { createGroup, getGroups, joinGroup, leaveGroup, setMyName } from "./groups";

beforeEach(() => localStorage.clear());

describe("grupos de estudio", () => {
  it("crea un grupo con código y creadora como miembro", () => {
    setMyName("Mila");
    const result = createGroup({ name: "Las Cerezas", subject: "Química", description: "", owner: "Mila" });
    expect("error" in result).toBe(false);
    if (!("error" in result)) {
      expect(result.code).toMatch(/^[A-Z2-9]{6}$/);
      expect(result.members).toEqual(["Mila"]);
      expect(getGroups()).toHaveLength(1);
    }
  });

  it("valida campos obligatorios", () => {
    expect("error" in createGroup({ name: "", subject: "X", description: "", owner: "Ana" })).toBe(true);
    expect("error" in createGroup({ name: "X", subject: "", description: "", owner: "Ana" })).toBe(true);
    expect("error" in createGroup({ name: "X", subject: "Y", description: "", owner: "" })).toBe(true);
  });

  it("permite unirse con el código y no duplica miembros", () => {
    const created = createGroup({ name: "Grupo", subject: "Física", description: "", owner: "Mila" });
    if ("error" in created) throw new Error("no debió fallar");
    const joined = joinGroup(created.code.toLowerCase(), "Ana");
    expect("error" in joined).toBe(false);
    if (!("error" in joined)) {
      expect(joined.members).toEqual(["Mila", "Ana"]);
      joinGroup(created.code, "Ana");
      expect(getGroups()[0].members).toEqual(["Mila", "Ana"]);
    }
  });

  it("rechaza códigos inexistentes", () => {
    const result = joinGroup("ZZZZZZ", "Ana");
    expect("error" in result).toBe(true);
  });

  it("permite salir del grupo", () => {
    const created = createGroup({ name: "Grupo", subject: "Arte", description: "", owner: "Mila" });
    if ("error" in created) throw new Error("no debió fallar");
    leaveGroup(created.id, "Mila");
    expect(getGroups()[0].members).toEqual([]);
  });
});
