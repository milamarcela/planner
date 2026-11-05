import Icon from "./Icon";
import type { IconName } from "./Icon";
import { useTheme } from "../theme";
import { getToken } from "../lib/spotify";
import { getProfile } from "../lib/profile";

type Tab = "today" | "schedule" | "subjects" | "groups" | "study" | "spotify";

const APP_TABS: Array<{ id: Tab; icon: IconName; label: string }> = [
  { id: "today", icon: "sparkle", label: "Hoy" },
  { id: "schedule", icon: "calendar", label: "Horario" },
  { id: "subjects", icon: "book", label: "Materias" },
  { id: "groups", icon: "users", label: "Grupos" },
  { id: "study", icon: "clock", label: "Estudiar" },
  { id: "spotify", icon: "music", label: "Spotify" },
];

export default function SiteNav({
  mode,
  activeTab,
  onTab,
}: {
  mode: "landing" | "app";
  activeTab?: Tab;
  onTab?: (t: Tab) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const spotifyLinked = !!getToken();
  const avatar = getProfile().avatar;

  return (
    <nav className="topnav">
      <a className="logo topnav-logo" href="#/">
        <Icon name="flower" size={24} color="var(--primary)" />
        StudyBloom
      </a>
      <div className="topnav-links">
        {mode === "landing" ? (
          <>
            <a className="topnav-link" href="#features">
              Funciones
            </a>
            <a className="topnav-link" href="#/app">
              Abrir la app
            </a>
          </>
        ) : (
          APP_TABS.map((t) => (
            <button
              key={t.id}
              className={activeTab === t.id ? "active" : ""}
              onClick={() => onTab?.(t.id)}
            >
              <Icon name={t.icon} size={16} />
              <span className="topnav-label">{t.label}</span>
            </button>
          ))
        )}
      </div>
      <div className="topnav-right">
        {mode === "app" && spotifyLinked && (
          <span className="spotify-chip" title="Spotify vinculado">
            <Icon name="music" size={13} />
            Spotify
          </span>
        )}
        {avatar && <img src={avatar} alt="Perfil" className="header-avatar" />}
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
          <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
        </button>
      </div>
    </nav>
  );
}
