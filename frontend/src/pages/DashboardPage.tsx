import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { ProjectStatusBadge } from "../components/ui/StatusBadge";
import { dashboardApi } from "../api/dashboard.api";
import { projectsApi } from "../api/projects.api";
import type { DashboardMetrics, Project } from "../types";
import { getApiErrorMessage } from "../utils/apiError";
import { isProjectOverdue, projectProgress } from "../utils/projectStatus";
import { OverdueBadge } from "../components/ui/StatusBadge";

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([dashboardApi.metrics(), projectsApi.list()])
      .then(([m, p]) => {
        setMetrics(m.data);
        setProjects(p.data.slice(0, 5));
      })
      .catch((err) => setError(getApiErrorMessage(err)));
  }, []);

  if (error) {
    return <p className="text-error">{error}</p>;
  }

  if (!metrics) {
    return <p className="text-on-surface-variant">Cargando dashboard...</p>;
  }

  const taskBars = [
    { label: "Completadas", count: metrics.tasks.byStatus.COMPLETADA, color: "bg-primary" },
    { label: "En progreso", count: metrics.tasks.byStatus.EN_PROGRESO, color: "bg-primary-container" },
    { label: "Pendientes", count: metrics.tasks.byStatus.PENDIENTE, color: "bg-surface-variant" },
  ];
  const maxTask = Math.max(...taskBars.map((b) => b.count), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          label="Proyectos totales"
          value={metrics.projects.total}
          icon="work"
          iconBg="bg-primary-fixed text-primary"
        />
        <KpiCard
          label="Tareas pendientes"
          value={metrics.tasks.byStatus.PENDIENTE}
          icon="pending_actions"
          iconBg="bg-secondary-fixed text-secondary"
        />
        <KpiCard
          label="Mis tareas"
          value={metrics.assignedTasks.total}
          icon="person_search"
          iconBg="bg-tertiary-fixed text-tertiary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
          <h4 className="text-xl font-semibold mb-6">Estado de tareas</h4>
          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-outline-variant">
            {taskBars.map((bar) => (
              <div key={bar.label} className="flex flex-col items-center w-full gap-2">
                <div
                  className={`${bar.color} w-full rounded-t-lg transition-all`}
                  style={{ height: `${(bar.count / maxTask) * 100}%`, minHeight: bar.count ? 8 : 4 }}
                />
                <span className="text-xs text-on-surface-variant">{bar.label}</span>
                <span className="text-xs font-bold">{bar.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary text-on-primary p-6 rounded-xl flex flex-col justify-between">
            <Icon name="bolt" />
            <div>
              <p className="text-3xl font-bold">{metrics.projects.total}</p>
              <p className="text-sm opacity-90">Proyectos activos</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-on-surface-variant">Tareas completadas</p>
            <p className="text-lg font-bold">{metrics.tasks.byStatus.COMPLETADA}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold">Proyectos recientes</h4>
          <Link to="/projects" className="text-primary text-sm hover:underline">
            Ver todos
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No hay proyectos aún.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant text-sm text-on-surface-variant">
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Progreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container">
                  <td className="py-4">
                    <Link to={`/projects/${p.id}`} className="font-medium hover:text-primary">
                      {p.name}
                    </Link>
                    {isProjectOverdue(p) && (
                      <div className="mt-1">
                        <OverdueBadge />
                      </div>
                    )}
                  </td>
                  <td className="py-4">
                    <ProjectStatusBadge status={p.status} />
                  </td>
                  <td className="py-4">
                    <div className="w-32 bg-surface-variant h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${projectProgress(p)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: number;
  icon: string;
  iconBg: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant flex items-center justify-between">
      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>
        <h3 className="text-4xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`${iconBg} p-4 rounded-full`}>
        <Icon name={icon} className="text-3xl" />
      </div>
    </div>
  );
}
