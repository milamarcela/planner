import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface PlayerState {
  kind: "track" | "playlist" | null;
  id: string | null;
  title: string;
}

interface PlayerContextValue {
  player: PlayerState;
  playTrack: (id: string, title: string) => void;
  playPlaylist: (id: string, title: string) => void;
  stop: () => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  player: { kind: null, id: null, title: "" },
  playTrack: () => {},
  playPlaylist: () => {},
  stop: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>({ kind: null, id: null, title: "" });

  const value: PlayerContextValue = {
    player,
    playTrack: (id, title) => setPlayer({ kind: "track", id, title }),
    playPlaylist: (id, title) => setPlayer({ kind: "playlist", id, title }),
    stop: () => setPlayer({ kind: null, id: null, title: "" }),
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  return useContext(PlayerContext);
}
