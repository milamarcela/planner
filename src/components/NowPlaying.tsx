import { useEffect, useState } from "react";
import Icon from "./Icon";
import { getNowPlaying } from "../lib/spotify";
import type { NowPlaying as NowPlayingData } from "../lib/spotify";

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000);
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

  if (!now) return null;
  const pct = now.durationMs > 0 ? Math.min(100, (now.progressMs / now.durationMs) * 100) : 0;

  return (
    <div className="now-playing">
      <div className="np-label">
        <span className={`np-dot${now.isPlaying ? " live" : ""}`} />
        {now.isPlaying ? "Sonando ahora" : "En pausa"}
      </div>
      <div className="np-body">
        {now.albumArt && <img src={now.albumArt} alt="" className="np-art" />}
        <div className="np-info">
          <div className="np-name">{now.name}</div>
          <div className="np-artist">{now.artist}</div>
          <div className="np-bar">
            <div className="np-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="np-times">
            {formatMs(now.progressMs)} / {formatMs(now.durationMs)}
          </div>
        </div>
        <Icon name="music" size={22} color="var(--primary)" />
      </div>
    </div>
  );
}
