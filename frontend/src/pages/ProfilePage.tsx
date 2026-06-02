import { useEffect, useState } from "react";
import { Icon } from "../components/ui/Icon";
import { Avatar } from "../components/ui/Avatar";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import type { JwtProfile } from "../types";
import { formatDate } from "../utils/projectStatus";
import { getApiErrorMessage } from "../utils/apiError";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<JwtProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authApi
      .profile()
      .then(({ data }) => setProfile(data))
      .catch((err) => setError(getApiErrorMessage(err)));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {error && <p className="text-error">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <Avatar name={user.name} className="w-32 h-32 md:w-40 md:h-40 text-2xl" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold">{user.name}</h3>
            <p className="text-lg text-on-surface-variant mt-2">{user.email}</p>
            {profile && (
              <p className="text-xs text-on-surface-variant mt-4">
                ID de sesión: {profile.userId}
              </p>
            )}
            {user.createdAt && (
              <div className="mt-6 inline-block bg-surface-container px-4 py-2 rounded-lg">
                <p className="text-xs text-outline uppercase">Miembro desde</p>
                <p className="font-semibold">{formatDate(user.createdAt)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary text-on-primary rounded-xl p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <Icon name="workspace_premium" className="text-[120px]" filled />
          </div>
          <div className="relative z-10">
            <p className="text-sm opacity-80 mb-1">Cuenta activa</p>
            <h4 className="text-xl font-bold mb-4">Task Manager</h4>
            <p className="text-sm opacity-90">
              Tu sesión JWT es válida y estás conectado a la API.
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-xl text-primary">
            <Icon name="person" />
          </div>
          <h3 className="text-xl font-semibold">Detalles de cuenta</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-on-surface-variant block mb-1">Nombre</label>
            <input
              readOnly
              value={user.name}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface-container-low"
            />
          </div>
          <div>
            <label className="text-sm text-on-surface-variant block mb-1">Email</label>
            <input
              readOnly
              value={user.email}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface-container-low"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
