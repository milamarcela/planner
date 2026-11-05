import { useRef, useState } from "react";
import Icon from "../components/Icon";
import { useTheme } from "../theme";
import { getProfile, readImageFile, saveProfile, setAvatar } from "../lib/profile";
import { getClasses } from "../lib/schedule";
import { getGroups, getMyName, setMyName } from "../lib/groups";
import { totalFocusMinutes } from "../lib/sessions";
import { connectSpotify, disconnectSpotify, getToken } from "../lib/spotify";

export default function ProfileView() {
  const [profile, setProfile] = useState(getProfile());
  const [error, setError] = useState("");
  const [spotifyLinked, setSpotifyLinked] = useState(!!getToken());
  const fileRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  const classes = getClasses().length;
  const groups = getGroups().filter((g) => g.members.includes(getMyName())).length;
  const minutes = totalFocusMinutes();

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
    <>
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
                setMyName(name);
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

      <div className="row">
        <div className="stat">
          <div className="num">{classes}</div>
          <div className="lbl">clases</div>
        </div>
        <div className="stat">
          <div className="num">{groups}</div>
          <div className="lbl">grupos</div>
        </div>
        <div className="stat">
          <div className="num">{minutes}</div>
          <div className="lbl">min de foco</div>
        </div>
      </div>

      <div className="card">
        <h3>
          <Icon name="music" size={19} color="var(--primary)" />
          Spotify
        </h3>
        {spotifyLinked ? (
          <div className="row">
            <span className="spotify-chip">
              <Icon name="check" size={13} />
              Vinculado
            </span>
            <button
              className="secondary"
              onClick={() => {
                disconnectSpotify();
                setSpotifyLinked(false);
              }}
            >
              <Icon name="logout" size={15} />
              Desvincular
            </button>
          </div>
        ) : (
          <button
            className="btn-solid"
            onClick={async () => {
              try {
                await connectSpotify();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <Icon name="heart" size={15} />
            Conectar Spotify
          </button>
        )}
      </div>

      <div className="card">
        <h3>
          <Icon name={theme === "light" ? "moon" : "sun"} size={19} color="var(--accent)" />
          Apariencia
        </h3>
        <button className="btn-outline" onClick={toggleTheme}>
          {theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
        </button>
      </div>
    </>
  );
}
