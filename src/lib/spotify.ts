const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export const SPOTIFY_CLIENT_ID =
  (import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined) ?? "";

const SCOPES = [
  "user-read-email",
  "playlist-read-private",
  "user-read-playback-state",
  "user-read-currently-playing",
].join(" ");
const TOKEN_KEY = "studybloom:spotifyToken";

export function isSpotifyConfigured(): boolean {
  return SPOTIFY_CLIENT_ID.length > 0;
}

function redirectUri(): string {
  const url = new URL(window.location.origin);
  if (url.hostname === "localhost") url.hostname = "127.0.0.1";
  return url.origin;
}

async function sha256(text: string): Promise<ArrayBuffer> {
  const data = new TextEncoder().encode(text);
  return crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
}

function base64Url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function connectSpotify(): Promise<void> {
  if (!isSpotifyConfigured()) {
    throw new Error(
      "Falta configurar el Client ID de Spotify. Crea una app en developer.spotify.com y define VITE_SPOTIFY_CLIENT_ID en un archivo .env",
    );
  }
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(48)).buffer as ArrayBuffer);
  const state = base64Url(crypto.getRandomValues(new Uint8Array(24)).buffer as ArrayBuffer);
  sessionStorage.setItem("studybloom:pkceVerifier", verifier);
  sessionStorage.setItem("studybloom:oauthState", state);
  const challenge = base64Url(await sha256(verifier));
  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: redirectUri(),
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });
  window.location.href = `${AUTH_URL}?${params.toString()}`;
}

export async function handleRedirectCallback(): Promise<boolean> {
  const params = new URLSearchParams(window.location.search);
  const oauthError = params.get("error");
  if (oauthError) {
    alert(`Spotify devolvió un error: ${oauthError}`);
    window.history.replaceState({}, "", redirectUri());
    return false;
  }
  const code = params.get("code");
  if (!code) return false;
  const verifier = sessionStorage.getItem("studybloom:pkceVerifier");
  const expectedState = sessionStorage.getItem("studybloom:oauthState");
  if (!verifier || !expectedState || params.get("state") !== expectedState) return false;
  sessionStorage.removeItem("studybloom:oauthState");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      code_verifier: verifier,
    }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { access_token: string; expires_in: number };
  sessionStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }),
  );
  window.history.replaceState({}, "", redirectUri());
  return true;
}

export function getToken(): string | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw) as { token: string; expiresAt: number };
    return Date.now() < expiresAt - 60_000 ? token : null;
  } catch {
    return null;
  }
}

export function disconnectSpotify(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  uri: string;
}

export async function searchTracks(query: string, limit = 8): Promise<SpotifyTrack[]> {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(
    `${API}/search?${new URLSearchParams({ q: query, type: "track", limit: String(limit) })}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    tracks: { items: Array<{ id: string; name: string; uri: string; artists: Array<{ name: string }>; album: { images: Array<{ url: string }> } }> };
  };
  return data.tracks.items.map((t) => ({
    id: t.id,
    name: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    albumArt: t.album.images[1]?.url ?? t.album.images[0]?.url ?? "",
    uri: t.uri,
  }));
}

export interface NowPlaying {
  name: string;
  artist: string;
  albumArt: string;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 204 || !res.ok) return null;
  const data = (await res.json()) as {
    is_playing: boolean;
    progress_ms: number;
    item: {
      name: string;
      duration_ms: number;
      artists: Array<{ name: string }>;
      album: { images: Array<{ url: string }> };
    } | null;
  };
  if (!data.item) return null;
  return {
    name: data.item.name,
    artist: data.item.artists.map((a) => a.name).join(", "),
    albumArt: data.item.album.images[1]?.url ?? data.item.album.images[0]?.url ?? "",
    progressMs: data.progress_ms,
    durationMs: data.item.duration_ms,
    isPlaying: data.is_playing,
  };
}

export function embedTrackUrl(trackId: string): string {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=studybloom`;
}

export function embedPlaylistUrl(playlistId: string): string {
  return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=studybloom`;
}

export const FOCUS_PLAYLISTS: Array<{ id: string; title: string }> = [
  { id: "37i9dQZF1DX5trt9i14X7j", title: "lofi hip hop radio — beats to relax/study to" },
  { id: "37i9dQZF1DX4WYUdFAU4U", title: "Peaceful Piano" },
  { id: "37i9dQZF1DWZqd5Ixl2K35", title: "Café & Jazz" },
];
