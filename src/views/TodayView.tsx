import { useMemo, useState } from "react";
import { DAY_NAMES } from "../types";
import type { ClassBlock } from "../types";
import Icon from "../components/Icon";
import { todayClasses, deleteClass } from "../lib/schedule";
import { getGroups, getMyName } from "../lib/groups";
import { totalFocusMinutes } from "../lib/sessions";

export default function TodayView() {
  const [, force] = useState(0);
  const today = new Date().getDay();
  const classes = useMemo(() => todayClasses(), [force]);
  const groups = getGroups().filter((g) => g.members.includes(getMyName()));
  const minutes = totalFocusMinutes();

  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const next = classes.find((c) => {
    const [h, m] = c.end.split(":").map(Number);
    return h * 60 + m > nowMin;
  });

  return (
    <>
      <div className="card">
        <h2>
          <Icon name="sparkle" size={22} color="var(--primary)" />
          {DAY_NAMES[today]} — qué toca hoy
        </h2>
        {classes.length === 0 ? (
          <p className="empty">No tienes clases hoy. Día libre para estudiar con calma.</p>
        ) : (
          classes.map((c) => (
            <ClassRow key={c.id} block={c} onDelete={() => force((n) => n + 1)} />
          ))
        )}
        {next && (
          <p className="muted" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="clock" size={15} color="var(--accent)" />
            Próxima clase: <strong>{next.subject}</strong> a las {next.start}
          </p>
        )}
      </div>

      <div className="row">
        <div className="stat">
          <div className="num">{classes.length}</div>
          <div className="lbl">clases hoy</div>
        </div>
        <div className="stat">
          <div className="num">{groups.length}</div>
          <div className="lbl">grupos</div>
        </div>
        <div className="stat">
          <div className="num">{minutes}</div>
          <div className="lbl">min de foco</div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="card">
          <h3>
            <Icon name="users" size={20} color="var(--accent)" />
            Tus grupos de estudio
          </h3>
          {groups.map((g) => (
            <p key={g.id} className="muted" style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="heart" size={14} color="var(--primary)" />
              <strong>{g.name}</strong> · {g.subject} · código {g.code}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

function ClassRow({ block, onDelete }: { block: ClassBlock; onDelete: () => void }) {
  return (
    <div className="today-item">
      <span className="icon-badge" style={{ background: block.color }}>
        <Icon name="book" size={20} />
      </span>
      <div style={{ flex: 1 }}>
        <strong>{block.subject}</strong>
        <div className="muted">
          {block.start} – {block.end}
          {block.room ? ` · ${block.room}` : ""}
          {block.teacher ? ` · ${block.teacher}` : ""}
        </div>
      </div>
      <button
        className="danger icon-btn"
        aria-label={`Eliminar ${block.subject}`}
        onClick={() => {
          if (confirm(`¿Eliminar ${block.subject}?`)) {
            deleteClass(block.id);
            onDelete();
          }
        }}
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  );
}
