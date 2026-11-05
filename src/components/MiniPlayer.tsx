import Icon from "./Icon";
import { usePlayer } from "../lib/player";
import { embedPlaylistUrl, embedTrackUrl } from "../lib/spotify";

export default function MiniPlayer() {
  const { player, stop } = usePlayer();

  if (!player.id || !player.kind) return null;

  const src =
    player.kind === "track" ? embedTrackUrl(player.id) : embedPlaylistUrl(player.id);

  return (
    <div className="mini-player">
      <span className="mp-icon">
        <Icon name="music" size={18} />
      </span>
      <span className="mp-title">{player.title}</span>
      <iframe className="mp-frame" src={src} title={player.title} loading="lazy" />
      <button className="ghost icon-btn" onClick={stop} aria-label="Dejar de reproducir">
        <Icon name="x" size={15} />
      </button>
    </div>
  );
}
