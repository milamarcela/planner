import { useState } from "react";
import { CLASS_COLORS, DAY_NAMES, WEEK_DAYS } from "../types";
import type { ClassBlock, DayOfWeek } from "../types";
import Icon from "../components/Icon";
import {
  addClass,
  classesForDay,
  deleteClass,
  findConflict,
  isValidRange,
  updateClass,
} from "../lib/schedule";

export default function ScheduleView() {
  const [, force] = useState(0);
  const [editing, setEditing] = useState<ClassBlock | null>(null);
  const rerender = () => force((n) => n + 1);

  return (
    <>
      <div className="card">
        <h2>
          <Icon name="calendar" size={22} color="var(--primary)" />
          Mi horario universitario
        </h2>
        <div className="grid-week">
          {WEEK_DAYS.map((d) => (
            <div className="day-col" key={d}>
              <h4>{DAY_NAMES[d]}</h4>
              {classesForDay(d as DayOfWeek).map((c) => (
                <div
                  key={c.id}
                  className="class-chip"
                  style={{ background: c.color, borderTopColor: "rgba(255,255,255,0.85)" }}
                  onClick={() => setEditing(c)}
                >
                  <span className="time">
                    <Icon name="clock" size={12} />
                    {c.start}–{c.end}
                  </span>
                  {c.subject}
                  {c.room && <span className="room">{c.room}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button style={{ marginTop: 8 }} onClick={() => setEditing({} as ClassBlock)}>
          <Icon name="plus" size={17} />
          Agregar clase
        </button>
      </div>
      {editing && (
        <ClassModal
          block={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            rerender();
          }}
        />
      )}
    </>
  );
}

function ClassModal({
  block,
  onClose,
  onSaved,
}: {
  block: ClassBlock;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !block.id;
  const [subject, setSubject] = useState(block.subject ?? "");
  const [day, setDay] = useState<DayOfWeek>(block.day ?? 1);
  const [start, setStart] = useState(block.start ?? "08:00");
  const [end, setEnd] = useState(block.end ?? "09:30");
  const [room, setRoom] = useState(block.room ?? "");
  const [teacher, setTeacher] = useState(block.teacher ?? "");
  const [color, setColor] = useState(block.color ?? CLASS_COLORS[0]);
  const [notes, setNotes] = useState(block.notes ?? "");
  const [error, setError] = useState("");

  const submit = () => {
    if (!subject.trim()) return setError("Escribe el nombre de la materia.");
    if (!isValidRange(start, end)) return setError("Revisa el horario: inicio debe ser antes que fin.");
    const conflict = findConflict({ day, start, end }, block.id);
    if (conflict) {
      return setError(`Se cruza con ${conflict.subject} (${conflict.start}–${conflict.end}).`);
    }
    const data = { subject: subject.trim(), day, start, end, room: room.trim(), teacher: teacher.trim(), color, notes: notes.trim() };
    if (isNew) addClass(data);
    else updateClass(block.id, data);
    onSaved();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          <Icon name={isNew ? "flower" : "pencil"} size={20} color="var(--primary)" />
          {isNew ? "Nueva clase" : "Editar clase"}
        </h3>
        {error && <div className="error">{error}</div>}
        <label>Materia</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ej. Cálculo II" />
        <div className="row">
          <div>
            <label>Día</label>
            <select value={day} onChange={(e) => setDay(Number(e.target.value) as DayOfWeek)}>
              {WEEK_DAYS.map((d) => (
                <option key={d} value={d}>
                  {DAY_NAMES[d]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Inicio</label>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label>Fin</label>
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Aula</label>
            <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Ej. 204" />
          </div>
          <div>
            <label>Profesor/a</label>
            <input value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="Ej. Prof. Ríos" />
          </div>
        </div>
        <label>Color</label>
        <div className="color-picker">
          {CLASS_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-dot${color === c ? " selected" : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <label>Notas</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej. Llevar laptop" rows={2} />
        <div className="row">
          <button onClick={submit}>
            <Icon name="check" size={16} />
            {isNew ? "Guardar" : "Actualizar"}
          </button>
          {!isNew && (
            <button
              className="danger"
              onClick={() => {
                if (confirm("¿Eliminar esta clase?")) {
                  deleteClass(block.id);
                  onSaved();
                }
              }}
            >
              <Icon name="trash" size={16} />
              Eliminar
            </button>
          )}
          <button className="ghost" onClick={onClose}>
            <Icon name="x" size={16} />
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
