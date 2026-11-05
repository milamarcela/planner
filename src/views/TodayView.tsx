import { useState } from "react";
import { DAY_NAMES } from "../types";
import Icon from "../components/Icon";
import { todayClasses, deleteClass } from "../lib/schedule";
import { getGroups, getMyName } from "../lib/groups";
import { totalFocusMinutes } from "../lib/sessions";
import type { ClassBlock } from "../types";

export default function TodayView() {
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);
  const classes = todayClasses();
  const groups = getGroups().filter((g) => g.members.includes(getMyName()));
  const minutes = totalFocusMinutes();

  // Se calculan al montar la vista: "hoy" no cambia mientras la usuaria navega.
  const [now] = useState(() => {
    const d = new Date();
    return { today: d.getDay(), minutesOfDay: d.getHours() * 60 + d.getMinutes() };
  });

  const next = classes.find((block) => {
    const [h, m] = block.end.split(":").map(Number);
    return h * 60 + m > now.minutesOfDay;
  });

  return (
    <>
      <div className="card">
        <h2>
          <Icon name="sparkle" size={22} color="var(--primary)" />
          {DAY_NAMES[now.today]} — qué toca hoy
        </h2>
        {classes.length === 0 ? (
          <p className="empty">No tienes clases hoy. Día libre para estudiar con calma.</p>
        ) : (
          classes.map((c) => <ClassRow key={c.id} block={c} onDelete={rerender} />)
        )}
        {next && (
          <p className="muted next-class">
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
            <p key={g.id} className="muted group-line">
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
      <div className="today-item-info">
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
