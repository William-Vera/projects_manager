import { NavLink } from "react-router-dom";
import { Icon } from "../ui/Icon";

const items = [
  { to: "/dashboard", icon: "home", label: "Inicio" },
  { to: "/projects", icon: "folder", label: "Proyectos" },
  { to: "/notifications", icon: "notifications", label: "Alertas" },
  { to: "/profile", icon: "person", label: "Perfil" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-container-lowest border-t border-outline-variant md:hidden shadow-lg">
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl px-3 py-1 text-xs ${
              isActive
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant"
            }`
          }
        >
          <Icon name={icon} className="text-xl" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
