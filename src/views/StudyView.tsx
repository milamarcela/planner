import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import NowPlaying from "../components/NowPlaying";
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

const QUICK_SEARCHES = ["lofi study", "Taylor Swift", "reggaeton", "jazz café", "piano relax"];

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
      <MusicPanel />
    </>
  );
}

function MusicPanel() {
  const [connected, setConnected] = useState(!!getToken());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [openPlaylist, setOpenPlaylist] = useState<string | null>(null);
  const [error, setError] = useState("");

  const search = async (q: string) => {
    setError("");
    if (!q.trim()) return;
    setQuery(q);
    const tracks = await searchTracks(q.trim());
    setResults(tracks);
    if (tracks.length === 0 && connected) setError("Sin resultados (o la sesión expiró).");
  };

  return (
    <div className="card music-panel">
      <h2>
        <Icon name="music" size={22} color="var(--primary)" />
        Música con Spotify
      </h2>

      {connected && <NowPlaying />}

      {!isSpotifyConfigured() && (
        <div className="spotify-hint">
          <p className="muted">
            Para buscar tu música y ver el widget "Sonando ahora" en vivo, crea una app en{" "}
            <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer">
              developer.spotify.com
            </a>{" "}
            y pega su <em>Client ID</em> en <code>VITE_SPOTIFY_CLIENT_ID</code> (archivo <code>.env</code>).
            Mientras tanto, usa las playlists de abajo — funcionan sin configuración.
          </p>
        </div>
      )}

      <div className="row" style={{ marginTop: 12 }}>
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
            className="btn-solid"
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
        <>
          <div className="row" style={{ marginTop: 12 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void search(query)}
              placeholder="Busca una canción o artista…"
              style={{ marginBottom: 0 }}
            />
            <button className="icon-btn btn-solid" onClick={() => void search(query)} aria-label="Buscar">
              <Icon name="search" size={18} />
            </button>
          </div>
          <div className="chip-list" style={{ marginTop: 8 }}>
            {QUICK_SEARCHES.map((q) => (
              <button key={q} className="quick-chip" onClick={() => void search(q)}>
                {q}
              </button>
            ))}
          </div>
        </>
      )}

      {results.map((t) => (
        <div key={t.id}>
          <div className="track-item">
            {t.albumArt && <img src={t.albumArt} alt="" />}
            <div className="info">
              <div className="name">{t.name}</div>
              <div className="artist">{t.artist}</div>
            </div>
            <button
              className={playing === t.id ? "secondary" : "btn-solid"}
              onClick={() => setPlaying(playing === t.id ? null : t.id)}
              aria-label="Reproducir"
            >
              <Icon name={playing === t.id ? "pause" : "play"} size={16} />
            </button>
          </div>
          {playing === t.id && (
            <iframe className="spotify-frame" src={embedTrackUrl(t.id)} title={t.name} loading="lazy" />
          )}
        </div>
      ))}

      <h3 style={{ marginTop: 16 }}>
        <Icon name="flower" size={18} color="var(--accent)" />
        Playlists para estudiar
      </h3>
      <div className="playlist-grid">
        {FOCUS_PLAYLISTS.map((p, i) => (
          <button
            key={p.id}
            className={`playlist-card${openPlaylist === p.id ? " open" : ""}`}
            onClick={() => setOpenPlaylist(openPlaylist === p.id ? null : p.id)}
          >
            <span className="playlist-cover" style={{ background: PLAYLIST_TINTS[i % PLAYLIST_TINTS.length] }}>
              <Icon name="music" size={26} color="#4a3542" />
            </span>
            <span className="playlist-title">{p.title}</span>
            <Icon name={openPlaylist === p.id ? "pause" : "play"} size={15} />
          </button>
        ))}
      </div>
      {openPlaylist && (
        <iframe
          className="spotify-frame"
          src={embedPlaylistUrl(openPlaylist)}
          title="Playlist"
          loading="lazy"
        />
      )}
    </div>
  );
}

const PLAYLIST_TINTS = [
  "linear-gradient(150deg,#f6a8c0,#ef8fb4)",
  "linear-gradient(150deg,#cdb4f6,#a58ae0)",
  "linear-gradient(150deg,#a8d8f0,#7fbfe0)",
];
