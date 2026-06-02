import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/projects/")) return "Detalle de proyecto";
  if (pathname.startsWith("/organizations/")) return "Organización";
  if (pathname.startsWith("/tasks/")) return "Detalle de tarea";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/projects")) return "Proyectos";
  if (pathname.startsWith("/organizations")) return "Organizaciones";
  if (pathname.startsWith("/notifications")) return "Notificaciones";
  if (pathname.startsWith("/profile")) return "Perfil";
  return "Task Manager";
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <TopBar title={title} onMenuClick={() => setMobileOpen(true)} />
      <main className="ml-0 md:ml-[260px] p-4 md:p-6 pb-24 md:pb-6 max-w-[1280px]">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
