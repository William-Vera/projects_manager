# Task Manager

Gestor de proyectos y tareas con autenticación JWT, organizaciones, notificaciones y dashboard.

## Estructura

- `backend/` — API REST (Express + Prisma + PostgreSQL)
- `frontend/` — React + Vite + Tailwind

## Inicio rápido

### Backend

```bash
cd backend
npm install
# Configura .env con DATABASE_URL y JWT_SECRET pilas ahí...
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# .env: API_URL=http://localhost:3000 si no con configurar el env por defecto es el port:3000 pilas ahí
npm run dev
```

Abre http://localhost:5173


![alt text](/frontend/images/image_1.png)
![alt text](/frontend/images/image_2.png)
![alt text](/frontend/images/image_3.png)
![alt text](/frontend/images/image_4.png)