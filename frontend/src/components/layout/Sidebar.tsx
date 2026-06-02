import { NavLink } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Avatar } from "../ui/Avatar";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/projects", icon: "folder_open", label: "Proyectos" },
  { to: "/organizations", icon: "corporate_fare", label: "Organizaciones" },
  { to: "/notifications", icon: "notifications", label: "Notificaciones" },
  { to: "/profile", icon: "person", label: "Perfil" },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={`flex flex-col h-screen py-4 px-2 w-[260px] fixed left-0 top-0 bg-surface-container border-r border-outline-variant z-50 transition-transform ${
        mobileOpen ? "flex" : "hidden md:flex"
      } ${mobileOpen ? "w-full max-w-[280px]" : ""}`}
    >
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-primary">Gestor de tareas</h1>
        <p className="text-xs text-on-surface-variant">v2.1.0</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-lg transition-colors text-sm ${
                isActive
                  ? "text-primary font-bold border-r-4 border-primary bg-surface-container-highest"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              }`
            }
          >
            <Icon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="mt-auto px-4 py-4 border-t border-outline-variant">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} />
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
