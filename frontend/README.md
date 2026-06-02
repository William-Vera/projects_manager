# Task Manager — Frontend

React 19 + Vite + Tailwind CSS 4. UI adaptada desde los diseños HTML (Stitch).

## Arranque

```bash
npm install
cp .env.example .env   # o crea .env con VITE_API_URL=http://localhost:3000
npm run dev
```

Asegúrate de que el backend esté en `http://localhost:3000`.

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/login` | Iniciar sesión |
| `/register` | Registro |
| `/dashboard` | Dashboard + métricas API |
| `/projects` | Lista y crear proyectos |
| `/projects/:id` | Detalle + kanban de tareas |
| `/organizations` | Organizaciones |
| `/organizations/:id` | Miembros y proyectos |
| `/tasks/:id` | Detalle de tarea (modal) |
| `/notifications` | Notificaciones |
| `/profile` | Perfil de usuario |

## Estructura

- `src/api/` — Cliente Axios + endpoints
- `src/store/authStore.ts` — JWT en localStorage
- `src/components/layout/` — Sidebar, TopBar (diseño compartido)
- `src/pages/` — Pantallas por ruta
