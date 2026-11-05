import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { getGroups, getMyName } from "../lib/groups";
import { finishSession, getSessions, startSession } from "../lib/sessions";
import {
  connectSpotify,
  disconnectSpotify,
  embedPlaylistUrl,
  embedTrackUrl,
  FOCUS_PLAYLISTS,
  getToken,
  isSpotifyConfigured,
  searchTracks,
} from "../lib/spotify";
import type { SpotifyTrack } from "../lib/spotify";

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
            <button onClick={start}>
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
      <MusicPanel />
    </>
  );
}

function MusicPanel() {
  const [connected, setConnected] = useState(!!getToken());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [error, setError] = useState("");

  const search = async () => {
    setError("");
    if (!query.trim()) return;
    const tracks = await searchTracks(query.trim());
    setResults(tracks);
    if (tracks.length === 0 && connected) setError("Sin resultados (o la sesión expiró).");
  };

  return (
    <div className="card">
      <h2>
        <Icon name="music" size={22} color="var(--primary)" />
        Música con Spotify
      </h2>
      {!isSpotifyConfigured() && (
        <p className="muted">
          Para buscar música necesitas crear una app en{" "}
          <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer">
            developer.spotify.com
          </a>{" "}
          y poner su <em>Client ID</em> en <code>VITE_SPOTIFY_CLIENT_ID</code> (archivo <code>.env</code>), con la
          URL de redirección <code>{typeof window !== "undefined" ? window.location.origin : ""}</code> registrada.
          Mientras tanto, disfruta estas playlists para estudiar:
        </p>
      )}
      <div className="row">
        {connected ? (
          <button
            className="secondary"
            onClick={() => {
              disconnectSpotify();
              setConnected(false);
              setResults([]);
            }}
          >
            <Icon name="logout" size={16} />
            Desconectar Spotify
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                await connectSpotify();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <Icon name="heart" size={16} />
            Conectar Spotify
          </button>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      {connected && (
        <div className="row" style={{ marginTop: 10 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void search()}
            placeholder="Busca una canción o artista…"
            style={{ marginBottom: 0 }}
          />
          <button className="icon-btn" onClick={() => void search()} aria-label="Buscar">
            <Icon name="search" size={18} />
          </button>
        </div>
      )}
      {results.map((t) => (
        <div key={t.id}>
          <div className="track-item">
            {t.albumArt && <img src={t.albumArt} alt="" />}
            <div className="info">
              <div className="name">{t.name}</div>
              <div className="artist">{t.artist}</div>
            </div>
            <button onClick={() => setPlaying(playing === t.id ? null : t.id)} aria-label="Reproducir">
              <Icon name={playing === t.id ? "pause" : "play"} size={16} />
            </button>
          </div>
          {playing === t.id && (
            <iframe className="spotify-frame" src={embedTrackUrl(t.id)} title={t.name} loading="lazy" />
          )}
        </div>
      ))}
      <h3 style={{ marginTop: 14 }}>
        <Icon name="flower" size={18} color="var(--accent)" />
        Playlists para estudiar
      </h3>
      {FOCUS_PLAYLISTS.map((p) => (
        <details key={p.id} style={{ marginBottom: 8 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>{p.title}</summary>
          <iframe className="spotify-frame" src={embedPlaylistUrl(p.id)} title={p.title} loading="lazy" />
        </details>
      ))}
    </div>
  );
}
