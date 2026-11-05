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
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  const classes = getClasses().length;
  const groups = getGroups().filter((g) => g.members.includes(getMyName())).length;
  const minutes = totalFocusMinutes();

  const update = (patch: Partial<typeof profile>) => {
    const next = { ...profile, ...patch };
    saveProfile(next);
    setProfile(next);
    if (patch.name !== undefined) setMyName(patch.name);
  };

  const onPick = async (file: File | undefined, kind: "avatar" | "cover") => {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readImageFile(file);
      if (kind === "avatar") setAvatar(dataUrl);
      else saveProfile({ ...getProfile(), cover: dataUrl });
      setProfile(getProfile());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <div className="card profile-hero">
        <div
          className="profile-cover"
          style={
            profile.cover
              ? { backgroundImage: `url(${profile.cover})` }
              : undefined
          }
        >
          <button className="cover-edit" onClick={() => coverRef.current?.click()}>
            <Icon name="pencil" size={13} />
            Cambiar portada
          </button>
        </div>
        <div className="profile-id">
          <button
            className="avatar-btn avatar-lg"
            onClick={() => avatarRef.current?.click()}
            aria-label="Cambiar foto de perfil"
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt="Tu foto" className="avatar avatar-xl" />
            ) : (
              <span className="avatar avatar-xl avatar-placeholder">
                <Icon name="flower" size={34} color="var(--primary)" />
              </span>
            )}
            <span className="avatar-edit">
              <Icon name="pencil" size={14} />
            </span>
          </button>
          <div className="profile-names">
            <input
              className="profile-name"
              value={profile.name}
              placeholder="tu nombre"
              onChange={(e) => update({ name: e.target.value })}
            />
            <input
              className="profile-quote"
              value={profile.quote}
              placeholder="tu frase favorita…"
              onChange={(e) => update({ quote: e.target.value })}
            />
          </div>
        </div>
        <textarea
          className="profile-bio"
          value={profile.bio}
          rows={2}
          placeholder="Cuéntanos algo sobre ti…"
          onChange={(e) => update({ bio: e.target.value })}
        />
        {error && <div className="error">{error}</div>}
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void onPick(e.target.files?.[0], "avatar")}
        />
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void onPick(e.target.files?.[0], "cover")}
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
