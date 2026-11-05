import { useRef, useState } from "react";
import Icon from "../components/Icon";
import type { SubjectCard } from "../lib/notes";
import {
  addImage,
  addSection,
  deleteSection,
  getSections,
  getSubjectCards,
  removeImage,
  updateSection,
} from "../lib/notes";
import type { NoteSection } from "../lib/notes";
import { readImageFile } from "../lib/profile";

export default function SubjectsView() {
  const [selected, setSelected] = useState<string | null>(null);
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);
  const cards = getSubjectCards();

  if (selected) {
    const card = cards.find((c) => c.subject === selected);
    return (
      <SubjectDetail
        subject={selected}
        color={card?.color ?? "#f6a8c0"}
        onBack={() => {
          setSelected(null);
          rerender();
        }}
      />
    );
  }

  return (
    <>
      <div className="card">
        <h2>
          <Icon name="book" size={22} color="var(--primary)" />
          Mis materias
        </h2>
        <p className="muted">
          Cada materia tiene su cuaderno: crea apartados con notas e imágenes (fotos de la pizarra, PDFs, etc.).
        </p>
      </div>
      {cards.length === 0 ? (
        <div className="card">
          <p className="empty">
            Aún no hay materias. Agrega tus clases en <strong>Horario</strong> y aparecerán aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="subjects-grid">
          {cards.map((c, i) => (
            <SubjectCardView
              key={c.subject}
              card={c}
              index={i}
              onOpen={() => setSelected(c.subject)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function SubjectCardView({
  card,
  index,
  onOpen,
}: {
  card: SubjectCard;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      className="subject-card"
      style={{ background: card.color, animationDelay: `${index * 70}ms` }}
      onClick={onOpen}
    >
      <span className="subject-icon">
        <Icon name="book" size={24} />
      </span>
      <span className="subject-name">{card.subject}</span>
      <span className="subject-meta">
        {card.sectionCount} apartados · {card.imageCount} imágenes
      </span>
    </button>
  );
}

function SubjectDetail({
  subject,
  color,
  onBack,
}: {
  subject: string;
  color: string;
  onBack: () => void;
}) {
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);
  const sections = getSections(subject);

  const addNew = () => {
    addSection(subject, color, "");
    rerender();
  };

  return (
    <>
      <div className="card detail-header" style={{ borderTop: `6px solid ${color}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="ghost icon-btn" onClick={onBack} aria-label="Volver">
            <Icon name="reset" size={17} />
          </button>
          <h2 style={{ margin: 0 }}>
            <Icon name="book" size={22} color="var(--primary)" />
            {subject}
          </h2>
        </div>
        <button style={{ marginTop: 12 }} onClick={addNew}>
          <Icon name="plus" size={16} />
          Nuevo apartado
        </button>
      </div>
      {sections.length === 0 && (
        <div className="card">
          <p className="empty">Sin apartados todavía. Crea uno para tomar notas e incluir imágenes.</p>
        </div>
      )}
      {sections.map((s, i) => (
        <SectionCard
          key={s.id}
          subject={subject}
          section={s}
          index={i}
          onChanged={rerender}
        />
      ))}
    </>
  );
}

function SectionCard({
  subject,
  section,
  index,
  onChanged,
}: {
  subject: string;
  section: NoteSection;
  index: number;
  onChanged: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readImageFile(file);
      addImage(subject, section.id, dataUrl);
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="card section-card" style={{ animationDelay: `${index * 70}ms` }}>
      <input
        className="section-title"
        value={section.title}
        placeholder="Título del apartado"
        onChange={(e) => {
          updateSection(subject, section.id, { title: e.target.value });
          onChanged();
        }}
      />
      <textarea
        value={section.text}
        rows={3}
        placeholder="Escribe tus notas aquí…"
        onChange={(e) => {
          updateSection(subject, section.id, { text: e.target.value });
        }}
        onBlur={onChanged}
      />
      {section.images.length > 0 && (
        <div className="image-grid">
          {section.images.map((img, i) => (
            <div className="image-thumb" key={i}>
              <img src={img} alt={`Imagen ${i + 1} de ${section.title}`} />
              <button
                className="danger icon-btn img-del"
                aria-label="Eliminar imagen"
                onClick={() => {
                  removeImage(subject, section.id, i);
                  onChanged();
                }}
              >
                <Icon name="trash" size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <div className="row" style={{ marginTop: 8 }}>
        <button className="secondary" onClick={() => fileRef.current?.click()}>
          <Icon name="plus" size={15} />
          Subir imagen
        </button>
        <button
          className="ghost"
          onClick={() => {
            if (confirm("¿Eliminar este apartado?")) {
              deleteSection(subject, section.id);
              onChanged();
            }
          }}
        >
          <Icon name="trash" size={15} />
          Eliminar apartado
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void onPick(e.target.files?.[0])}
      />
    </div>
  );
}
