import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";
import SiteNav from "../components/SiteNav";

const FEATURES: Array<{ icon: IconName; title: string; text: string; tint: string }> = [
  {
    icon: "calendar",
    title: "Horario universitario",
    text: "Tus clases por día y hora con colores, aulas y profesores. Detecta traslapes al instante.",
    tint: "#f6a8c0",
  },
  {
    icon: "book",
    title: "Cuaderno por materia",
    text: "Apartados con bloques estilo Notion: títulos, tareas, listas, citas e imágenes.",
    tint: "#cdb4f6",
  },
  {
    icon: "users",
    title: "Grupos de estudio",
    text: "Crea un grupo y comparte un código de invitación para estudiar con tus amigas.",
    tint: "#a8d8f0",
  },
  {
    icon: "music",
    title: "Spotify + modo foco",
    text: "Widget de lo que suena ahora, búsqueda de canciones y temporizador Pomodoro.",
    tint: "#b8e6c8",
  },
  {
    icon: "clock",
    title: "Modo estudio",
    text: "Sesiones de concentración con historial de minutos de foco acumulados.",
    tint: "#ffe3a3",
  },
  {
    icon: "moon",
    title: "Tema claro y oscuro",
    text: "Diseño rosa coquette con modo oscuro que respeta las preferencias de tu sistema.",
    tint: "#f5a8d0",
  },
];

const STEPS = [
  { icon: "flower" as IconName, title: "Crea tu horario", text: "Agrega tus materias en segundos." },
  { icon: "users" as IconName, title: "Invita a tu grupo", text: "Comparte el código de 6 caracteres." },
  { icon: "play" as IconName, title: "Pon música y enfócate", text: "Pomodoro + Spotify Now Playing." },
];

const CLASS_PREVIEW = [
  { subject: "Cálculo II", meta: "08:00–10:00 · Aula 204", color: "#f6a8c0" },
  { subject: "Química", meta: "10:30–12:00 · Lab 1", color: "#cdb4f6" },
  { subject: "Psicología", meta: "14:00–16:00 · Aula B8", color: "#a8d8f0" },
];

export default function Landing() {
  const enter = () => (window.location.hash = "#/app");

  return (
    <div className="landing">
      <div className="hero-bg" aria-hidden="true" />
      <span className="float-deco deco-1" aria-hidden="true"><Icon name="flower" size={44} /></span>
      <span className="float-deco deco-2" aria-hidden="true"><Icon name="sparkle" size={30} /></span>
      <span className="float-deco deco-3" aria-hidden="true"><Icon name="heart" size={26} /></span>
      <SiteNav mode="landing" />

      <section className="hero">
        <div className="hero-badge">
          <Icon name="sparkle" size={14} />
          Tu compañera de estudio
        </div>
        <h1>
          Organiza tu universidad,
          <br />
          <span className="hero-accent">estudia con estilo.</span>
        </h1>
        <p className="hero-sub">
          Horarios, cuadernos por materia, grupos de estudio y música con Spotify en una sola app.
          Linda por fuera, poderosa por dentro — en tu PC y en tu celular.
        </p>
        <div className="hero-cta">
          <button className="btn-lg btn-solid" onClick={enter}>
            <Icon name="calendar" size={18} />
            Empezar ahora — es gratis
          </button>
          <a className="btn-lg btn-outline" href="#features">
            Ver funciones
          </a>
        </div>

        <div className="hero-preview card">
          <div className="window-bar">
            <span className="win-dot" style={{ background: "#f6a8c0" }} />
            <span className="win-dot" style={{ background: "#ffe3a3" }} />
            <span className="win-dot" style={{ background: "#b8e6c8" }} />
            <span className="win-title">StudyBloom — Hoy</span>
          </div>
          <div className="preview-rows">
            {CLASS_PREVIEW.map((c) => (
              <div className="preview-row" key={c.subject}>
                <span className="preview-badge" style={{ background: c.color }}>
                  <Icon name="book" size={15} />
                </span>
                <div className="preview-info">
                  <strong>{c.subject}</strong>
                  <span className="muted">{c.meta}</span>
                </div>
                <Icon name="clock" size={15} color="var(--text-soft)" />
              </div>
            ))}
            <div className="preview-row now-playing-preview">
              <span className="preview-badge np-badge">
                <Icon name="music" size={15} />
              </span>
              <div className="preview-info">
                <strong>lofi beats — Sonando ahora</strong>
                <span className="muted">modo estudio · 25:00</span>
              </div>
              <span className="np-dot live" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section-badge">
          <Icon name="sparkle" size={13} />
          Funciones
        </div>
        <h2 className="section-title">Todo lo que necesitas para estudiar mejor</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="card feature-card" key={f.title}>
              <span className="feature-icon" style={{ background: f.tint }}>
                <Icon name={f.icon} size={24} color="#4a3542" />
              </span>
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-badge">
          <Icon name="heart" size={13} />
          Súper fácil
        </div>
        <h2 className="section-title">En tres pasos</h2>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div className="card step-card" key={s.title}>
              <span className="step-num">{i + 1}</span>
              <span className="feature-icon">
                <Icon name={s.icon} size={22} />
              </span>
              <h3>{s.title}</h3>
              <p className="muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <h2>¿Lista para organizar tu semestre?</h2>
        <p>Tus datos se guardan en tu dispositivo. Sin registros, sin complicaciones.</p>
        <button className="btn-lg btn-solid btn-on-accent" onClick={enter}>
          <Icon name="heart" size={17} />
          Crear mi planner
        </button>
      </section>

      <footer className="landing-footer">
        <div className="logo" style={{ fontSize: "1.3rem" }}>
          <Icon name="flower" size={22} color="var(--primary)" />
          StudyBloom
        </div>
        <p className="muted">Hecho con cariño para estudiantes.</p>
      </footer>
    </div>
  );
}
