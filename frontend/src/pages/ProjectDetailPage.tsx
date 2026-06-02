import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Modal } from "../components/ui/Modal";
import { ProjectStatusBadge, TaskStatusBadge, OverdueBadge } from "../components/ui/StatusBadge";
import { projectsApi } from "../api/projects.api";
import { tasksApi } from "../api/tasks.api";
import type { Project, ProjectStatus, Task, TaskStatus } from "../types";
import { formatDate, isProjectOverdue } from "../utils/projectStatus";
import { getApiErrorMessage } from "../utils/apiError";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    if (!id) return;
    Promise.all([projectsApi.getById(id), tasksApi.listByProject(id)])
      .then(([p, t]) => {
        setProject(p.data);
        setTasks(t.data);
      })
      .catch((err) => setError(getApiErrorMessage(err)));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm("¿Eliminar este proyecto?")) return;
    try {
      await projectsApi.remove(id);
      navigate("/projects");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleStatusChange = async (status: ProjectStatus) => {
    if (!id) return;
    try {
      await projectsApi.update(id, { status });
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (error) return <p className="text-error">{error}</p>;
  if (!project) return <p className="text-on-surface-variant">Cargando...</p>;

  const columns: { status: TaskStatus; label: string }[] = [
    { status: "PENDIENTE", label: "Pendiente" },
    { status: "EN_PROGRESO", label: "En progreso" },
    { status: "COMPLETADA", label: "Completada" },
  ];

  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-primary text-sm flex items-center gap-1 hover:underline">
        <Icon name="arrow_back" className="text-lg" />
        Volver a proyectos
      </Link>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
        <div className="flex flex-wrap justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {isProjectOverdue(project) && (
              <div className="mt-2">
                <OverdueBadge />
              </div>
            )}
            <p className="text-on-surface-variant mt-2">{project.description}</p>
          </div>
          <div className="flex gap-2 items-start">
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm"
            >
              <option value="PLANIFICADO">Planificado</option>
              <option value="EN_CURSO">En curso</option>
              <option value="COMPLETADO">Completado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <button
              type="button"
              onClick={handleDelete}
              className="text-error border border-error/30 px-4 py-2 rounded-lg text-sm hover:bg-error-container/20"
            >
              Eliminar
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
          <span>Inicio: {formatDate(project.startDate)}</span>
          <span>Fin: {formatDate(project.endDate)}</span>
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tareas</h2>
        <button
          type="button"
          onClick={() => setShowTaskModal(true)}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Icon name="add" />
          Nueva tarea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.status}
            className="bg-surface-container-low rounded-xl p-4 border border-outline-variant min-h-[200px]"
          >
            <h3 className="font-semibold mb-4 text-sm uppercase text-on-surface-variant">
              {col.label}
            </h3>
            <div className="space-y-3">
              {tasks
                .filter((t) => t.status === col.status)
                .map((t) => (
                  <Link
                    key={t.id}
                    to={`/tasks/${t.id}`}
                    className="block bg-surface-container-lowest p-3 rounded-lg border border-outline-variant hover:border-primary transition-colors"
                  >
                    <p className="font-medium text-sm">{t.title}</p>
                    <TaskStatusBadge status={t.status} />
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && id && (
        <CreateTaskModal
          projectId={id}
          onClose={() => setShowTaskModal(false)}
          onCreated={() => {
            setShowTaskModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateTaskModal({
  projectId,
  onClose,
  onCreated,
}: {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tasksApi.create(projectId, {
        title,
        description: description || null,
        dueDate: dueDate || null,
      });
      onCreated();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Nueva tarea" onClose={onClose} wide>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-error text-sm">{error}</p>}
        <input
          required
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 min-h-[60px]"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg"
        >
          {loading ? "Creando..." : "Crear tarea"}
        </button>
      </form>
    </Modal>
  );
}
