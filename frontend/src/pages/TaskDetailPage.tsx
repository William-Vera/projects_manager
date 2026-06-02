import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { TaskStatusBadge } from "../components/ui/StatusBadge";
import { tasksApi } from "../api/tasks.api";
import type { Task, TaskStatus } from "../types";
import { formatDate } from "../utils/projectStatus";
import { getApiErrorMessage } from "../utils/apiError";

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!id) return;
    tasksApi
      .getById(id)
      .then(({ data }) => setTask(data))
      .catch((err) => setError(getApiErrorMessage(err)));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleStatus = async (status: TaskStatus) => {
    if (!id) return;
    setSaving(true);
    try {
      await tasksApi.updateStatus(id, status);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("¿Eliminar esta tarea?")) return;
    try {
      await tasksApi.remove(id);
      navigate(task?.projectId ? `/projects/${task.projectId}` : "/projects");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (error && !task) return <p className="text-error">{error}</p>;
  if (!task) return <p className="text-on-surface-variant">Cargando...</p>;

  const overdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "COMPLETADA";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-inverse-surface/20 backdrop-blur-sm"
        onClick={() => navigate(task.projectId ? `/projects/${task.projectId}` : "/projects")}
        aria-hidden
      />
      <div className="relative w-full max-w-4xl bg-white rounded-xl task-panel-shadow overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between p-8 border-b border-outline-variant">
          <div>
            {task.project && (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
                <span className="bg-secondary-container/20 px-2 py-0.5 rounded-full text-xs uppercase">
                  Proyecto
                </span>
                <Link
                  to={`/projects/${task.projectId}`}
                  className="hover:text-primary"
                >
                  {task.project.name}
                </Link>
              </div>
            )}
            <h3 className="text-2xl font-semibold">{task.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => navigate(task.projectId ? `/projects/${task.projectId}` : "/projects")}
            className="p-2 hover:bg-surface-container-high rounded-full"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <section>
                <h4 className="text-xs uppercase text-outline tracking-wider mb-2">Descripción</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  {task.description || "Sin descripción"}
                </p>
              </section>
            </div>
            <div className="space-y-6 border-l border-outline-variant pl-0 md:pl-8">
              <div>
                <p className="text-xs font-bold text-on-surface-variant mb-2">ESTADO</p>
                <select
                  value={task.status}
                  disabled={saving}
                  onChange={(e) => handleStatus(e.target.value as TaskStatus)}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROGRESO">En progreso</option>
                  <option value="COMPLETADA">Completada</option>
                </select>
                <div className="mt-2">
                  <TaskStatusBadge status={task.status} />
                </div>
              </div>
              {overdue && (
                <div>
                  <p className="text-xs font-bold text-on-surface-variant mb-2">ALERTA</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-error-container text-on-error-container text-sm">
                    <Icon name="priority_high" className="text-sm mr-1" />
                    VENCIDA
                  </span>
                </div>
              )}
              {task.assignedTo && (
                <div>
                  <p className="text-xs font-bold text-on-surface-variant mb-2">ASIGNADO A</p>
                  <p className="text-sm font-semibold">{task.assignedTo.name}</p>
                  <p className="text-xs text-on-surface-variant">{task.assignedTo.email}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-on-surface-variant mb-2">FECHA LÍMITE</p>
                <div className={`flex items-center gap-2 ${overdue ? "text-error" : ""}`}>
                  <Icon name="calendar_today" />
                  <span className="text-sm font-semibold">{formatDate(task.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-container-lowest border-t border-outline-variant flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-2 text-error hover:bg-error-container/10 rounded-xl"
          >
            <Icon name="delete" />
            Eliminar tarea
          </button>
        </div>
      </div>
    </div>
  );
}
