import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";

const FEATURES: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "calendar",
    title: "Horario universitario",
    text: "Organiza tus clases por día y hora con colores, aulas y profesores. Detecta traslapes al instante.",
  },
  {
    icon: "users",
    title: "Grupos de estudio",
    text: "Crea grupos, comparte un código de invitación y estudia con tus amigas desde cualquier dispositivo.",
  },
  {
    icon: "music",
    title: "Spotify + modo foco",
    text: "Conecta Spotify, mira qué suena ahora mismo y estudia con temporizador Pomodoro y playlists de concentración.",
  },
  {
    icon: "moon",
    title: "Tema claro y oscuro",
    text: "Diseño rosa coquette con modo oscuro automático según tu sistema. Se ve bien de día y de noche.",
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
      <header className="landing-nav">
        <div className="logo">
          <Icon name="flower" size={28} color="var(--primary)" />
          StudyBloom
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a className="btn-link" href="#features">
            Funciones
          </a>
          <button onClick={onEnter}>
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
          Horarios, grupos de estudio y música con Spotify en una sola app. Diseñada para verse linda y
          funcionar en tu PC y en tu celular.
        </p>
        <div className="hero-cta">
          <button className="btn-lg" onClick={onEnter}>
            <Icon name="calendar" size={18} />
            Empezar ahora — es gratis
          </button>
          <a className="btn-lg ghost" href="#features">
            Ver funciones
          </a>
        </div>
        <div className="hero-preview card">
          <div className="preview-grid">
            <div className="preview-col" style={{ background: "#f6a8c0" }}>
              <strong>Cálculo II</strong>
              <span>08:00–10:00 · Aula 204</span>
            </div>
            <div className="preview-col" style={{ background: "#cdb4f6" }}>
              <strong>Química</strong>
              <span>10:30–12:00 · Lab 1</span>
            </div>
            <div className="preview-col" style={{ background: "#a8d8f0" }}>
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
              <span className="feature-icon">
                <Icon name={f.icon} size={24} />
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
        <div style={{ textAlign: "center", marginTop: 26 }}>
          <button className="btn-lg" onClick={onEnter}>
            <Icon name="heart" size={17} />
            Crear mi planner
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="logo" style={{ fontSize: "1.3rem" }}>
          <Icon name="flower" size={22} color="var(--primary)" />
          StudyBloom
        </div>
        <p className="muted">Hecho con cariño para estudiantes. Tus datos se guardan en tu dispositivo.</p>
      </footer>
    </div>
  );
}
