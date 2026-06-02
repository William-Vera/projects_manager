import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { AuthFooterLink } from "../components/layout/AuthLayout";
import { useAuthStore } from "../store/authStore";
import { getApiErrorMessage } from "../utils/apiError";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-center text-on-surface-variant mb-6 text-sm">
        Crea tu cuenta para empezar a organizar
      </p>
      <div className="auth-card w-full max-w-[480px] bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-sm text-error bg-error-container/30 p-3 rounded-lg">{error}</p>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant" htmlFor="name">
              Nombre completo
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-surface border border-outline rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@empresa.com"
              className="w-full bg-surface border border-outline rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-surface border border-outline rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant" htmlFor="confirm">
              Confirmar contraseña
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-medium py-3 rounded-lg hover:bg-primary-container disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
      <AuthFooterLink text="¿Ya tienes una cuenta?" linkText="Iniciar Sesión" to="/login" />
    </>
  );
}
