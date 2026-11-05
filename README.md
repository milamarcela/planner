# StudyBloom 🌸

Planner universitario kawaii/coquette para PC y Android (PWA instalable): horarios de clase,
grupos de estudio con códigos de invitación, cuadernos por materia estilo Notion y música con
Spotify mientras estudias. Tema claro 🌞 y oscuro 🌙.

## Stack

- React 19 + TypeScript + Vite
- PWA completa: manifest + íconos maskable + service worker (instalable en Android y funciona sin conexión)
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
3. Registra la URL de redirección `http://127.0.0.1:5173` (Spotify solo permite HTTP en loopback con IP explícita, no `localhost`).
4. En la pestaña **🎧 Estudiar** o **Spotify** pulsa "Conectar Spotify".

Sin configurar el Client ID, la app sigue mostrando playlists embebidas de study vibes.

## Instalar la app (PWA)

- **Android (Chrome):** abre el sitio publicado → menú ⋮ → *"Añadir a pantalla de inicio"*/ *"Instalar app"*. Aparece con su ícono, pantalla completa y funciona sin conexión (el service worker cachea el shell).
- **PC (Chrome/Edge):** icono de instalación en la barra de direcciones.
- El manifest define íconos `any` + `maskable` (recortes circulares de Android) y `theme_color` que tiñe la barra de estado según el tema claro/oscuro.

## Empaquetar como APK

La app ya es una PWA instalable, así que tienes dos caminos sin cambiar el código:

**Opción A — PWABuilder (sin instalar nada):**

1. Publica la app (ver abajo) con HTTPS.
2. Entra a [pwabuilder.com](https://www.pwabuilder.com), pega la URL del sitio y pulsa *Package for stores* → **Android**.
3. Descarga el APK/AAB generado (Trust Shared UserId) e instálalo directo o publícalo en Google Play.

**Opción B — Capacitor (control nativo total):**

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init StudyBloom com.milamarcela.studybloom --web-dir=dist
npx cap add android
npx cap sync android
npx cap open android   # compila el APK desde Android Studio
```

Consejo: con Capacitor registra la URL de redirección de Spotify como `com.milamarcela.studybloom:/` (deep link) y añade el esquema en `AndroidManifest.xml`.

## Pruebas y build

```bash
npm test        # vitest (lógica de horarios, grupos y notas)
npm run build   # typecheck + build de producción (dist/)
npm run lint    # oxlint, 0 warnings
```

## Publicar como sitio web (GitHub Pages)

La app ya es un sitio formal: landing en `#/` y la app en `#/app`.

1. `npm run build` genera `dist/` (con `base: './'`, funciona en cualquier subruta)
2. En GitHub: **Settings → Pages → Source: Deploy from a branch** y elige la carpeta `/docs`, o usa un workflow de GitHub Actions que publique `dist/`

## Estructura

```
src/
├── App.tsx            # rutas (#/ y #/app) + tema claro/oscuro
├── components/        # SiteNav (sidebar PC / barra inferior móvil), Modal, MiniPlayer…
├── views/             # Hoy, Horario, Materias, Grupos, Estudiar, Spotify, Perfil
├── lib/               # lógica pura con tests: schedule, groups, notes, sessions…
└── landing/           # página pública
```

## Próximos pasos (fuera del prototipo local)

- Backend con cuentas de usuaria para grupos en tiempo real entre dispositivos
- Notificaciones de clase próxima y recordatorios de sesiones de estudio
