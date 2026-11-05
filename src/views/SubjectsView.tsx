import { useRef, useState } from "react";
import Icon from "../components/Icon";
import type { BlockType, NoteBlock, NoteSection, SubjectCard } from "../lib/notes";
import {
  addBlock,
  addSection,
  deleteSection,
  getSections,
  getSubjectCards,
  removeBlock,
  updateBlock,
  updateSectionTitle,
} from "../lib/notes";
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
          Cada materia tiene su cuaderno: crea apartados con bloques al estilo Notion — títulos, texto,
          tareas, listas, citas e imágenes.
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
          {cards.map((c) => (
            <SubjectCardView
              key={c.subject}
              card={c}
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
  onOpen,
}: {
  card: SubjectCard;
  onOpen: () => void;
}) {
  return (
    <button
      className="subject-card"
      style={{ background: `linear-gradient(160deg, ${card.color}, ${card.color}b3)` }}
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
        <button style={{ marginTop: 12 }} onClick={() => {
          addSection(subject, color, "");
          rerender();
        }}>
          <Icon name="plus" size={16} />
          Nuevo apartado
        </button>
      </div>
      {sections.length === 0 && (
        <div className="card">
          <p className="empty">Sin apartados todavía. Crea uno y empieza a escribir con bloques.</p>
        </div>
      )}
      {sections.map((s) => (
        <SectionCard key={s.id} subject={subject} section={s} onChanged={rerender} />
      ))}
    </>
  );
}

const BLOCK_MENU: Array<{ type: BlockType; label: string; icon: "plus" | "check" | "book" | "heart" | "flower" }> = [
  { type: "heading", label: "Título", icon: "book" },
  { type: "paragraph", label: "Texto", icon: "plus" },
  { type: "todo", label: "Tarea", icon: "check" },
  { type: "bullet", label: "Lista", icon: "flower" },
  { type: "quote", label: "Cita", icon: "heart" },
];

function SectionCard({
  subject,
  section,
  onChanged,
}: {
  subject: string;
  section: NoteSection;
  onChanged: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readImageFile(file);
      addBlock(subject, section.id, "image", dataUrl);
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="card section-card">
      <input
        className="section-title"
        value={section.title}
        placeholder="Título del apartado"
        onChange={(e) => {
          updateSectionTitle(subject, section.id, e.target.value);
          onChanged();
        }}
      />
      <div className="blocks">
        {section.blocks.map((b) => (
          <BlockView
            key={b.id}
            subject={subject}
            sectionId={section.id}
            block={b}
            onChanged={onChanged}
          />
        ))}
        {section.blocks.length === 0 && (
          <p className="muted">Apartado vacío — agrega tu primer bloque abajo.</p>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      <div className="block-menu">
        {BLOCK_MENU.map((m) => (
          <button
            key={m.type}
            className="ghost block-btn"
            onClick={() => {
              addBlock(subject, section.id, m.type);
              onChanged();
            }}
          >
            <Icon name={m.icon} size={14} />
            {m.label}
          </button>
        ))}
        <button
          className="ghost block-btn"
          onClick={() => {
            addBlock(subject, section.id, "divider");
            onChanged();
          }}
        >
          <Icon name="reset" size={14} />
          Separador
        </button>
        <button className="ghost block-btn" onClick={() => fileRef.current?.click()}>
          <Icon name="plus" size={14} />
          Imagen
        </button>
        <button
          className="danger block-btn"
          onClick={() => {
            if (confirm("¿Eliminar este apartado?")) {
              deleteSection(subject, section.id);
              onChanged();
            }
          }}
        >
          <Icon name="trash" size={14} />
          Eliminar
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

function BlockView({
  subject,
  sectionId,
  block,
  onChanged,
}: {
  subject: string;
  sectionId: string;
  block: NoteBlock;
  onChanged: () => void;
}) {
  const remove = () => {
    removeBlock(subject, sectionId, block.id);
    onChanged();
  };

  if (block.type === "divider") {
    return (
      <div className="block-row">
        <hr className="block-divider" />
        <button className="ghost icon-btn block-del" onClick={remove} aria-label="Eliminar bloque">
          <Icon name="x" size={13} />
        </button>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="block-row">
        <div className="image-thumb block-image">
          {block.src && <img src={block.src} alt="Imagen del apunte" />}
          <button className="danger icon-btn img-del" onClick={remove} aria-label="Eliminar imagen">
            <Icon name="trash" size={13} />
          </button>
        </div>
      </div>
    );
  }

  const isHeading = block.type === "heading";
  const isQuote = block.type === "quote";
  const isTodo = block.type === "todo";
  const isBullet = block.type === "bullet";

  return (
    <div className="block-row">
      {isTodo && (
        <input
          type="checkbox"
          className="block-checkbox"
          checked={block.checked ?? false}
          onChange={(e) => {
            updateBlock(subject, sectionId, block.id, { checked: e.target.checked });
            onChanged();
          }}
        />
      )}
      {isBullet && <span className="block-bullet">•</span>}
      <input
        className={`block-input${isHeading ? " block-heading" : ""}${isQuote ? " block-quote" : ""}${
          isTodo && block.checked ? " block-done" : ""
        }`}
        value={block.text}
        placeholder={
          isHeading ? "Título" : isTodo ? "Tarea…" : isQuote ? "Cita…" : isBullet ? "Elemento" : "Escribe aquí…"
        }
        onChange={(e) => {
          updateBlock(subject, sectionId, block.id, { text: e.target.value });
          onChanged();
        }}
      />
      <button className="ghost icon-btn block-del" onClick={remove} aria-label="Eliminar bloque">
        <Icon name="x" size={13} />
      </button>
    </div>
  );
}
