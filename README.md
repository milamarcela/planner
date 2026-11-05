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

Abrir http://localhost:5173 (en el celular de la misma red: `npm run dev -- --host`).

## Conectar Spotify

1. Crea una app en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Copia `.env.example` a `.env` y pega tu `Client ID`.
3. Registra la URL de redirección (ej. `http://localhost:5173/`).
4. En la pestaña **🎧 Estudiar** pulsa "Conectar Spotify".

Sin configurar el Client ID, la app sigue mostrando playlists embebidas de study vibes.

## Pruebas y build

```bash
npm test        # vitest (lógica de horarios y grupos)
npm run build   # typecheck + build de producción
```

## Próximos pasos (fuera del prototipo local)

- Backend con cuentas de usuaria para grupos en tiempo real entre dispositivos
- Envolver con Capacitor (Android/iOS nativo) o Electron (PC de escritorio)
- Notificaciones de clase próxima y recordatorios de sesiones de estudio
