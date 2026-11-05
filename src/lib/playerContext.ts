import { createContext, useContext } from "react";

export interface PlayerState {
  kind: "track" | "playlist" | null;
  id: string | null;
  title: string;
}

export interface PlayerContextValue {
  player: PlayerState;
  playTrack: (id: string, title: string) => void;
  playPlaylist: (id: string, title: string) => void;
  stop: () => void;
}

export const PlayerContext = createContext<PlayerContextValue>({
  player: { kind: null, id: null, title: "" },
  playTrack: () => {},
  playPlaylist: () => {},
  stop: () => {},
});

export function usePlayer(): PlayerContextValue {
  return useContext(PlayerContext);
}
