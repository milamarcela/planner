import { useEffect, useState } from "react";
import { ThemeContext, initialTheme } from "./theme";
import type { Theme } from "./theme";
import SiteNav from "./components/SiteNav";
import Landing from "./landing/Landing";
import TodayView from "./views/TodayView";
import ScheduleView from "./views/ScheduleView";
import SubjectsView from "./views/SubjectsView";
import GroupsView from "./views/GroupsView";
import StudyView from "./views/StudyView";
import { handleRedirectCallback } from "./lib/spotify";

type Tab = "today" | "schedule" | "subjects" | "groups" | "study";

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
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("studybloom:theme", theme);
  }, [theme]);

  useEffect(() => {
    if (import.meta.env.DEV && window.location.hostname === "localhost") {
      const url = new URL(window.location.href);
      url.hostname = "127.0.0.1";
      window.location.replace(url.toString());
      return;
    }
    void handleRedirectCallback().then((handled) => {
      if (handled && !window.location.hash.startsWith("#/app")) {
        window.location.hash = "#/app";
      }
    });
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {route === "landing" ? <Landing /> : <Planner />}
    </ThemeContext.Provider>
  );
}

function Planner() {
  const [tab, setTab] = useState<Tab>("today");

  return (
    <div className="app">
      <SiteNav mode="app" activeTab={tab} onTab={setTab} />
      <main>
        {tab === "today" && <TodayView />}
        {tab === "schedule" && <ScheduleView />}
        {tab === "subjects" && <SubjectsView />}
        {tab === "groups" && <GroupsView />}
        {tab === "study" && <StudyView />}
      </main>
    </div>
  );
}
