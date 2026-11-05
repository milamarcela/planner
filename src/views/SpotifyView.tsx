import { useState } from "react";
import Icon from "../components/Icon";
import NowPlaying from "../components/NowPlaying";
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

const PLAYLIST_TINTS = [
  "linear-gradient(150deg,#f6a8c0,#ef8fb4)",
  "linear-gradient(150deg,#cdb4f6,#a58ae0)",
  "linear-gradient(150deg,#a8d8f0,#7fbfe0)",
];

export default function SpotifyView() {
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
    <>
      <div className="card music-panel">
        <h2>
          <Icon name="music" size={22} color="var(--primary)" />
          Spotify
        </h2>

        {connected ? (
          <>
            <NowPlaying />
            <div className="row" style={{ marginTop: 12 }}>
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
            </div>
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
        ) : (
          <>
            <div className="spotify-hint">
              <p className="muted">
                {isSpotifyConfigured()
                  ? "Conecta tu cuenta de Spotify para ver el widget «Sonando ahora» en vivo y buscar tu música."
                  : "Para buscar tu música y ver el widget «Sonando ahora» en vivo, crea una app en developer.spotify.com y pega su Client ID en VITE_SPOTIFY_CLIENT_ID (archivo .env). Mientras tanto, usa las playlists de abajo — funcionan sin configuración."}
              </p>
            </div>
            <button
              className="btn-solid"
              style={{ marginTop: 12 }}
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
          </>
        )}
        {error && <div className="error">{error}</div>}

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
    </>
  );
}
