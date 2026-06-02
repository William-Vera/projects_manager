import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export function GuestRoute() {
  const { token, hydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-on-surface-variant">Cargando...</p>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
