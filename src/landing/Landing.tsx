import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";

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
    text: "Apartados tipo notebook con notas e imágenes: fotos de la pizarra, esquemas, PDFs.",
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

export default function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="landing">
      <div className="hero-bg" aria-hidden="true" />
      <header className="landing-nav">
        <div className="logo">
          <Icon name="flower" size={28} color="var(--primary)" />
          StudyBloom
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a className="btn-link" href="#features">
            Funciones
          </a>
          <button className="btn-solid" onClick={onEnter}>
            <Icon name="sparkle" size={16} />
            Abrir la app
          </button>
        </div>
      </header>

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
          <button className="btn-lg btn-solid" onClick={onEnter}>
            <Icon name="calendar" size={18} />
            Empezar ahora — es gratis
          </button>
          <a className="btn-lg btn-outline" href="#features">
            Ver funciones
          </a>
        </div>
        <div className="hero-preview card">
          <div className="preview-grid">
            <div className="preview-col" style={{ background: "linear-gradient(160deg,#f6a8c0,#f08bb0)" }}>
              <strong>Cálculo II</strong>
              <span>08:00–10:00 · Aula 204</span>
            </div>
            <div className="preview-col" style={{ background: "linear-gradient(160deg,#cdb4f6,#b39ae8)" }}>
              <strong>Química</strong>
              <span>10:30–12:00 · Lab 1</span>
            </div>
            <div className="preview-col" style={{ background: "linear-gradient(160deg,#a8d8f0,#8ec4e4)" }}>
              <strong>Psicología</strong>
              <span>14:00–16:00 · Aula B8</span>
            </div>
            <div className="preview-col now-playing-preview">
              <span className="np-label">
                <span className="np-dot live" /> Sonando ahora
              </span>
              <strong>lofi beats</strong>
              <span className="muted">modo estudio · 25:00</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
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
        <button className="btn-lg btn-solid btn-on-accent" onClick={onEnter}>
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
