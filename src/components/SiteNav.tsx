import Icon from "./Icon";
import type { IconName } from "./Icon";
import { useTheme } from "../theme";
import { getToken } from "../lib/spotify";
import { getProfile } from "../lib/profile";
import type { Tab } from "../App";

const APP_TABS: Array<{ id: Tab; icon: IconName; label: string }> = [
  { id: "today", icon: "sparkle", label: "Hoy" },
  { id: "schedule", icon: "calendar", label: "Horario" },
  { id: "subjects", icon: "book", label: "Materias" },
  { id: "groups", icon: "users", label: "Grupos" },
  { id: "study", icon: "clock", label: "Estudiar" },
  { id: "spotify", icon: "music", label: "Spotify" },
  { id: "profile", icon: "heart", label: "Perfil" },
];

/** Lista de pestañas de la app: en escritorio vive en el sidebar, en móvil en la barra inferior. */
export function AppTabs({
  activeTab,
  onTab,
  variant,
}: {
  activeTab: Tab;
  onTab: (t: Tab) => void;
  variant: "side" | "bottom";
}) {
  return (
    <>
      {APP_TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={activeTab === t.id ? "active" : ""}
          aria-current={activeTab === t.id ? "page" : undefined}
          onClick={() => onTab(t.id)}
        >
          <Icon name={t.icon} size={variant === "bottom" ? 20 : 17} />
          <span className="topnav-label">{t.label}</span>
        </button>
      ))}
    </>
  );
}

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
    <>
      <nav className={`topnav${mode === "app" ? " sidenav" : ""}`}>
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
            <div className="sidenav-links">
              <AppTabs activeTab={activeTab ?? "today"} onTab={onTab ?? (() => {})} variant="side" />
            </div>
          )}
        </div>

        <div className="topnav-right">
          {mode === "app" && spotifyLinked && (
            <span className="spotify-chip" title="Spotify vinculado">
              <Icon name="music" size={13} />
              <span className="topnav-label">Spotify</span>
            </span>
          )}
          {mode === "app" && avatar && (
            <img src={avatar} alt="Perfil" className="header-avatar" />
          )}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
          </button>
        </div>
      </nav>

      {mode === "app" && (
        <nav className="bottomnav" aria-label="Secciones de StudyBloom">
          <AppTabs activeTab={activeTab ?? "today"} onTab={onTab ?? (() => {})} variant="bottom" />
        </nav>
      )}
    </>
  );
}
