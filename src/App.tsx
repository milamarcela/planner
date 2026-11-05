import { useEffect, useState } from "react";
import { ThemeContext, initialTheme } from "./theme";
import type { Theme } from "./theme";
import Icon from "./components/Icon";
import type { IconName } from "./components/Icon";
import Landing from "./landing/Landing";
import TodayView from "./views/TodayView";
import ScheduleView from "./views/ScheduleView";
import SubjectsView from "./views/SubjectsView";
import GroupsView from "./views/GroupsView";
import StudyView from "./views/StudyView";
import { handleRedirectCallback } from "./lib/spotify";
import { getProfile } from "./lib/profile";

type Tab = "today" | "schedule" | "subjects" | "groups" | "study";

const TABS: Array<{ id: Tab; icon: IconName; label: string }> = [
  { id: "today", icon: "sparkle", label: "Hoy" },
  { id: "schedule", icon: "calendar", label: "Horario" },
  { id: "subjects", icon: "book", label: "Materias" },
  { id: "groups", icon: "users", label: "Grupos" },
  { id: "study", icon: "music", label: "Estudiar" },
];

function useHashRoute(): "landing" | "app" {
  const [route, setRoute] = useState<"landing" | "app">(
    window.location.hash.startsWith("#/app") ? "app" : "landing",
  );
  useEffect(() => {
    const onChange = () =>
      setRoute(window.location.hash.startsWith("#/app") ? "app" : "landing");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export default function App() {
  const route = useHashRoute();
  if (route === "landing") {
    return <Landing onEnter={() => (window.location.hash = "#/app")} />;
  }
  return <Planner />;
}

function Planner() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [tab, setTab] = useState<Tab>("today");
  const [pageKey, setPageKey] = useState<Tab>("today");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("studybloom:theme", theme);
  }, [theme]);

  useEffect(() => {
    void handleRedirectCallback();
  }, []);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const go = (t: Tab) => {
    setTab(t);
    setPageKey(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggle }}>
      <div className="app">
        <nav className="navbar">
          <a className="logo navbar-logo" href="#/">
            <Icon name="flower" size={24} color="var(--primary)" />
            StudyBloom
          </a>
          <div className="navbar-links">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "active" : ""}
                onClick={() => go(t.id)}
              >
                <Icon name={t.icon} size={16} />
                <span className="navbar-label">{t.label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {getProfile().avatar && (
              <img src={getProfile().avatar} alt="Perfil" className="header-avatar" />
            )}
            <button className="theme-toggle" onClick={toggle} aria-label="Cambiar tema">
              <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
            </button>
          </div>
        </nav>
        <main key={pageKey} className="page-enter">
          {tab === "today" && <TodayView />}
          {tab === "schedule" && <ScheduleView />}
          {tab === "subjects" && <SubjectsView />}
          {tab === "groups" && <GroupsView />}
          {tab === "study" && <StudyView />}
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
