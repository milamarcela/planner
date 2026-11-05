import { useEffect, useState } from "react";
import Icon from "./Icon";
import { getNowPlaying } from "../lib/spotify";
import type { NowPlaying as NowPlayingData } from "../lib/spotify";

function formatMs(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function NowPlaying() {
  const [now, setNow] = useState<NowPlayingData | null>(null);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      const data = await getNowPlaying();
      if (active) setNow(data);
    };
    void poll();
    const id = window.setInterval(poll, 8000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  if (!now) {
    return (
      <div className="np-card np-empty">
        <span className="np-empty-icon">
          <Icon name="music" size={30} />
        </span>
        <div>
          <strong>Nada sonando ahora</strong>
          <p className="muted">Pon música en Spotify (cualquier dispositivo) y aparecerá aquí en vivo.</p>
        </div>
      </div>
    );
  }

  const pct = now.durationMs > 0 ? Math.min(100, (now.progressMs / now.durationMs) * 100) : 0;

  return (
    <div className="np-card">
      {now.albumArt && <img src={now.albumArt} alt="Portada" className="np-art-lg" />}
      <div className="np-main">
        <div className="np-label">
          <span className={`np-dot${now.isPlaying ? " live" : ""}`} />
          {now.isPlaying ? "Sonando ahora" : "En pausa"}
        </div>
        <div className="np-name">{now.name}</div>
        <div className="np-artist">{now.artist}</div>
        <div className="np-bar">
          <div className="np-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="np-times">
          {formatMs(now.progressMs)} / {formatMs(now.durationMs)}
        </div>
        <button
          className="np-open"
          onClick={() => window.open(`https://open.spotify.com/track/${now.id}`, "_blank", "noopener")}
        >
          <Icon name={now.isPlaying ? "pause" : "play"} size={15} />
          {now.isPlaying ? "Pausar en Spotify" : "Reproducir en Spotify"}
        </button>
      </div>
    </div>
  );
}
