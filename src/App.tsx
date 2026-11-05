import { useEffect, useState } from "react";
import { ThemeContext, initialTheme } from "./theme";
import type { Theme } from "./theme";
import Icon from "./components/Icon";
import TodayView from "./views/TodayView";
import ScheduleView from "./views/ScheduleView";
import GroupsView from "./views/GroupsView";
import StudyView from "./views/StudyView";
import { handleRedirectCallback } from "./lib/spotify";
import { getProfile } from "./lib/profile";

type Tab = "today" | "schedule" | "groups" | "study";

const TABS: Array<{ id: Tab; icon: "sparkle" | "calendar" | "users" | "music"; label: string }> = [
  { id: "today", icon: "sparkle", label: "Hoy" },
  { id: "schedule", icon: "calendar", label: "Horario" },
  { id: "groups", icon: "users", label: "Grupos" },
  { id: "study", icon: "music", label: "Estudiar" },
];

export default function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [tab, setTab] = useState<Tab>("today");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("studybloom:theme", theme);
  }, [theme]);

  useEffect(() => {
    void handleRedirectCallback();
  }, []);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggle }}>
      <div className="app">
        <header className="header">
          <div className="logo">
            <Icon name="flower" size={30} color="var(--primary)" />
            StudyBloom
          </div>
          {getProfile().avatar && (
            <img src={getProfile().avatar} alt="Perfil" className="header-avatar" />
          )}
          <button className="theme-toggle" onClick={toggle} aria-label="Cambiar tema">
            <Icon name={theme === "light" ? "moon" : "sun"} size={20} />
          </button>
        </header>
        {tab === "today" && <TodayView />}
        {tab === "schedule" && <ScheduleView />}
        {tab === "groups" && <GroupsView />}
        {tab === "study" && <StudyView />}
        <nav className="nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={17} />
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </ThemeContext.Provider>
  );
}
