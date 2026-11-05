import { useState } from "react";
import type { StudyGroup } from "../types";
import Icon from "../components/Icon";
import {
  createGroup,
  deleteGroup,
  getGroups,
  getMyName,
  joinGroup,
  leaveGroup,
  setMyName,
} from "../lib/groups";

export default function GroupsView() {
  const [, force] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const rerender = () => force((n) => n + 1);
  const groups = getGroups();

  return (
    <>
      <div className="card">
        <h2>
          <Icon name="users" size={22} color="var(--primary)" />
          Grupos de estudio
        </h2>
        <p className="muted">
          Crea un grupo y comparte el código con tus amigas para estudiar juntas.
          <br />
          <em>En este prototipo los grupos viven en este dispositivo; con un backend se sincronizarán entre usuarias.</em>
        </p>
        <label>Tu nombre</label>
        <input
          defaultValue={getMyName()}
          placeholder="Ej. Mila"
          onBlur={(e) => {
            setMyName(e.target.value);
            rerender();
          }}
        />
        <div className="row">
          <button onClick={() => setShowCreate(true)}>
            <Icon name="flower" size={16} />
            Crear grupo
          </button>
          <JoinByCode onJoined={rerender} />
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="card">
          <p className="empty">Aún no hay grupos. Crea el primero y comparte el código.</p>
        </div>
      ) : (
        groups.map((g) => (
          <GroupCard key={g.id} group={g} onChanged={rerender} />
        ))
      )}

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            rerender();
          }}
        />
      )}
    </>
  );
}

function JoinByCode({ onJoined }: { onJoined: () => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button className="secondary" onClick={() => setOpen(true)}>
        <Icon name="key" size={16} />
        Unirme con código
      </button>
    );
  }

  const submit = () => {
    const result = joinGroup(code, getMyName());
    if ("error" in result) return setError(result.error);
    setOpen(false);
    setCode("");
    setError("");
    onJoined();
  };

  return (
    <div style={{ flex: 1 }}>
      {error && <div className="error">{error}</div>}
      <div className="row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (6 letras)"
          style={{ marginBottom: 0 }}
        />
        <button onClick={submit}>
          <Icon name="check" size={16} />
          Unirme
        </button>
        <button className="ghost icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar">
          <Icon name="x" size={16} />
        </button>
      </div>
    </div>
  );
}

function CreateGroupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const result = createGroup({ name, subject, description, owner: getMyName() });
    if ("error" in result) return setError(result.error);
    onCreated();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          <Icon name="flower" size={20} color="var(--primary)" />
          Nuevo grupo de estudio
        </h3>
        {error && <div className="error">{error}</div>}
        <label>Nombre del grupo</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Las Cerezas" />
        <label>Materia</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ej. Química Orgánica" />
        <label>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej. Repasamos el capítulo 4 los martes"
          rows={2}
        />
        <div className="row">
          <button onClick={submit}>
            <Icon name="heart" size={16} />
            Crear
          </button>
          <button className="ghost" onClick={onClose}>
            <Icon name="x" size={16} />
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupCard({ group, onChanged }: { group: StudyGroup; onChanged: () => void }) {
  const myName = getMyName();
  return (
    <div className="card group-card">
      <h3>
        <Icon name="ribbon" size={20} color="var(--accent)" />
        {group.name} <span className="muted">· {group.subject}</span>
      </h3>
      {group.description && <p className="muted">{group.description}</p>}
      <div>
        Código para invitar: <span className="code">{group.code}</span>
      </div>
      <div className="chip-list">
        {group.members.map((m) => (
          <span key={m} className="member-chip">
            <Icon name="heart" size={12} color="var(--primary)" />
            {m === myName ? `${m} (tú)` : m}
          </span>
        ))}
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <button
          className="ghost"
          onClick={() => {
            const name = getMyName();
            if (name) leaveGroup(group.id, name);
            onChanged();
          }}
        >
          Salir
        </button>
        <button
          className="danger"
          onClick={() => {
            if (confirm(`¿Eliminar el grupo ${group.name}?`)) {
              deleteGroup(group.id);
              onChanged();
            }
          }}
        >
          <Icon name="trash" size={15} />
          Eliminar grupo
        </button>
      </div>
    </div>
  );
}
