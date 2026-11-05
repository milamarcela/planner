# StudyBloom 🌸

Planner universitario kawaii/coquette para PC y Android (PWA instalable): horarios de clase,
grupos de estudio con códigos de invitación y música con Spotify mientras estudias.
Tema claro 🌞 y oscuro 🌙.

## Stack

- React 19 + TypeScript + Vite
- PWA (manifest + service-ready) — corre en navegador de PC y se instala en Android desde el menú "Añadir a pantalla de inicio"
- Persistencia local con `localStorage`
- Integración Spotify Web API con OAuth PKCE (búsqueda) + reproductor embebido

## Ejecutar

```bash
npm install
npm run dev
```

Abrir http://127.0.0.1:5173 (en desarrollo la app redirige sola a 127.0.0.1 porque Spotify solo acepta esa URI en local; en el celular de la misma red: `npm run dev -- --host` y usa la IP de tu PC).

## Conectar Spotify

1. Crea una app en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Copia `.env.example` a `.env` y pega tu `Client ID`.
3. Registra la URL de redirección `http://127.0.0.1:5173/` (Spotify solo permite HTTP en loopback con IP explícita, no `localhost`).
4. En la pestaña **🎧 Estudiar** pulsa "Conectar Spotify".

Sin configurar el Client ID, la app sigue mostrando playlists embebidas de study vibes.

## Pruebas y build

```bash
npm test        # vitest (lógica de horarios y grupos)
npm run build   # typecheck + build de producción
```

## Publicar como sitio web (GitHub Pages)

La app ya es un sitio formal: landing en `#/` y la app en `#/app`.

1. `npm run build` genera `dist/` (con `base: './'`, funciona en cualquier subruta)
2. En GitHub: **Settings → Pages → Source: Deploy from a branch** y elige la carpeta `/docs`, o usa un workflow de GitHub Actions que publique `dist/`
3. El `public/404.html` hace de fallback para que `#/app` funcione al recargar

## Próximos pasos (fuera del prototipo local)

- Backend con cuentas de usuaria para grupos en tiempo real entre dispositivos
- Envolver con Capacitor (Android/iOS nativo) o Electron (PC de escritorio)
- Notificaciones de clase próxima y recordatorios de sesiones de estudio
