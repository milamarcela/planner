import { useState } from "react";
import Icon from "./Icon";
import { usePlayer } from "../lib/player";
import { embedPlaylistUrl, embedTrackUrl } from "../lib/spotify";

const SIZES = [
  { w: 170, h: 60, showTitle: false },
  { w: 250, h: 80, showTitle: true },
  { w: 330, h: 152, showTitle: true },
];

const SIZE_KEY = "studybloom:playerSize";

export default function MiniPlayer() {
  const { player, stop } = usePlayer();
  const [sizeIdx, setSizeIdx] = useState(() => {
    const saved = Number(localStorage.getItem(SIZE_KEY) ?? 1);
    return saved >= 0 && saved < SIZES.length ? saved : 1;
  });

  if (!player.id || !player.kind) return null;

  const src = player.kind === "track" ? embedTrackUrl(player.id) : embedPlaylistUrl(player.id);
  const size = SIZES[sizeIdx];

  const cycleSize = () => {
    const next = (sizeIdx + 1) % SIZES.length;
    setSizeIdx(next);
    localStorage.setItem(SIZE_KEY, String(next));
  };

  return (
    <div className="mini-player">
      <span className="mp-icon">
        <Icon name="music" size={18} />
      </span>
      {size.showTitle && <span className="mp-title">{player.title}</span>}
      <iframe
        className="mp-frame"
        src={src}
        title={player.title}
        loading="lazy"
        style={{ width: size.w, height: size.h }}
      />
      <button
        className="ghost icon-btn"
        onClick={cycleSize}
        aria-label="Cambiar tamaño del reproductor"
        title="Cambiar tamaño del reproductor"
      >
        <Icon name="plus" size={14} />
      </button>
      <button className="ghost icon-btn" onClick={stop} aria-label="Dejar de reproducir">
        <Icon name="x" size={15} />
      </button>
    </div>
  );
}
