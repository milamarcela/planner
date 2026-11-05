import { useRef, useState } from "react";
import Icon from "./Icon";
import { getProfile, readImageFile, saveProfile, setAvatar } from "../lib/profile";

export default function ProfileCard() {
  const [profile, setProfile] = useState(getProfile());
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readImageFile(file);
      setAvatar(dataUrl);
      setProfile(getProfile());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="card profile-card">
      <div className="profile-row">
        <button
          className="avatar-btn"
          onClick={() => fileRef.current?.click()}
          aria-label="Subir foto de perfil"
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt="Tu foto" className="avatar" />
          ) : (
            <span className="avatar avatar-placeholder">
              <Icon name="flower" size={26} color="var(--primary)" />
            </span>
          )}
          <span className="avatar-edit">
            <Icon name="pencil" size={13} />
          </span>
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 4 }}>
            <Icon name="sparkle" size={20} color="var(--primary)" />
            Mi perfil
          </h2>
          <input
            value={profile.name}
            placeholder="Tu nombre"
            style={{ marginBottom: 4 }}
            onChange={(e) => {
              const name = e.target.value;
              saveProfile({ ...profile, name });
              setProfile({ ...profile, name });
            }}
          />
          <span className="muted">Toca la foto para subir una imagen desde tu dispositivo.</span>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
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
