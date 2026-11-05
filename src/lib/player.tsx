import { useState } from "react";
import type { ReactNode } from "react";
import { PlayerContext } from "./playerContext";
import type { PlayerState } from "./playerContext";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>({ kind: null, id: null, title: "" });

  const value = {
    player,
    playTrack: (id: string, title: string) => setPlayer({ kind: "track", id, title }),
    playPlaylist: (id: string, title: string) => setPlayer({ kind: "playlist", id, title }),
    stop: () => setPlayer({ kind: null, id: null, title: "" }),
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
