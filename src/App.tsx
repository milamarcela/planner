import { useEffect, useState } from "react";
import { ThemeContext, initialTheme } from "./theme";
import type { Theme } from "./theme";
import TodayView from "./views/TodayView";
import ScheduleView from "./views/ScheduleView";
import GroupsView from "./views/GroupsView";
import StudyView from "./views/StudyView";
import { handleRedirectCallback } from "./lib/spotify";

type Tab = "today" | "schedule" | "groups" | "study";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "today", label: "🌸 Hoy" },
  { id: "schedule", label: "📅 Horario" },
  { id: "groups", label: "👯 Grupos" },
  { id: "study", label: "🎧 Estudiar" },
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

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")) }}
    >
      <div className="app">
        <header className="header">
          <div className="logo">StudyBloom 🌸</div>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label="Cambiar tema"
          >
            {theme === "light" ? "🌙" : "☀️"}
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
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </ThemeContext.Provider>
  );
}
