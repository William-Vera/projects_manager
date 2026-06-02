import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { AuthFooterLink } from "../components/layout/AuthLayout";
import { useAuthStore } from "../store/authStore";
import { getApiErrorMessage } from "../utils/apiError";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Credenciales incorrectas"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-center text-on-surface-variant mb-6 text-sm">
        Bienvenido de nuevo. Gestiona tus proyectos con eficiencia.
      </p>
      <section className="auth-card w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-on-surface mb-6">Iniciar sesión</h2>
        {error && (
          <p className="mb-4 text-sm text-error bg-error-container/30 p-3 rounded-lg">
            {error}
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant block" htmlFor="email">
              Correo electrónico
            </label>
            <div className="relative group">
              <Icon
                name="mail"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary"
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@empresa.com"
                className="w-full bg-surface border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant block" htmlFor="password">
              Contraseña
            </label>
            <div className="relative group">
              <Icon
                name="lock"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary"
              />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-outline-variant rounded-lg py-4 pl-12 pr-12 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant"
                onClick={() => setShowPass(!showPass)}
              >
                <Icon name={showPass ? "visibility_off" : "visibility"} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-medium py-4 rounded-lg hover:bg-primary-container active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {loading ? "Cargando..." : "Entrar"}
            {!loading && <Icon name="arrow_forward" className="text-lg" />}
          </button>
        </form>
      </section>
      <AuthFooterLink
        text="¿No tienes una cuenta?"
        linkText="Regístrate gratis"
        to="/register"
      />
    </>
  );
}
