import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { getGroups, getMyName } from "../lib/groups";
import { finishSession, getSessions, startSession } from "../lib/sessions";

export default function StudyView() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string>("");
  const [done, setDone] = useState(0);
  const timerRef = useRef<number | null>(null);

  const myGroups = getGroups().filter((g) => g.members.includes(getMyName()));
  const completed = getSessions().filter((s) => s.finishedAt).length;

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(timerRef.current!);
          setRunning(false);
          if (sessionId) finishSession(sessionId);
          setDone((d) => d + 1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running, sessionId]);

  const start = () => {
    const s = startSession(groupId || null, minutes);
    setSessionId(s.id);
    setSecondsLeft(minutes * 60);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(minutes * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <>
      <div className="card">
        <h2>
          <Icon name="clock" size={22} color="var(--primary)" />
          Modo estudio
        </h2>
        <div className="timer-display">{mm}:{ss}</div>
        <div className="row" style={{ maxWidth: 300, margin: "0 auto 10px" }}>
          {[15, 25, 45, 60].map((m) => (
            <button
              key={m}
              className={minutes === m ? "" : "secondary"}
              onClick={() => {
                setMinutes(m);
                if (!running) setSecondsLeft(m * 60);
              }}
            >
              {m}m
            </button>
          ))}
        </div>
        {myGroups.length > 0 && (
          <>
            <label>Grupo de estudio (opcional)</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              <option value="">Solo yo</option>
              {myGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} · {g.subject}
                </option>
              ))}
            </select>
          </>
        )}
        <div className="row">
          {!running ? (
            <button className="btn-solid" onClick={start}>
              <Icon name="play" size={16} />
              Empezar a estudiar
            </button>
          ) : (
            <button className="secondary" onClick={() => setRunning(false)}>
              <Icon name="pause" size={16} />
              Pausar
            </button>
          )}
          <button className="ghost" onClick={reset}>
            <Icon name="reset" size={16} />
            Reiniciar
          </button>
        </div>
        <p className="muted" style={{ textAlign: "center", marginTop: 10 }}>
          Sesiones completadas: <strong>{completed + done}</strong>
        </p>
      </div>
    </>
  );
}

