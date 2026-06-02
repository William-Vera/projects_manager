import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Modal } from "../components/ui/Modal";
import { ProjectStatusBadge, OverdueBadge } from "../components/ui/StatusBadge";
import { Avatar } from "../components/ui/Avatar";
import { projectsApi } from "../api/projects.api";
import { organizationsApi } from "../api/organizations.api";
import type { Organization, Project, ProjectStatus } from "../types";
import { formatDate, isProjectOverdue } from "../utils/projectStatus";
import { getApiErrorMessage } from "../utils/apiError";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([projectsApi.list(), organizationsApi.list()])
      .then(([p, o]) => {
        setProjects(p.data);
        setOrgs(o.data);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filterStatus
    ? projects.filter((p) => p.status === filterStatus)
    : projects;

  const overdueCount = projects.filter((p) => isProjectOverdue(p)).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <p className="text-on-surface-variant mb-1">Gestión integral de flujos de trabajo</p>
          <div className="flex gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
              {projects.length} Activos
            </span>
            {overdueCount > 0 && (
              <span className="bg-error/10 text-error px-2 py-1 rounded-full text-xs font-semibold">
                {overdueCount} Críticos
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-medium flex items-center gap-2 shadow-md hover:brightness-110"
        >
          <Icon name="add" />
          Crear proyecto
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl mb-6 flex flex-wrap gap-4 items-center">
        <Icon name="filter_list" className="text-outline" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant rounded-lg text-sm py-1 px-2"
        >
          <option value="">Todos los Estados</option>
          <option value="PLANIFICADO">Planificado</option>
          <option value="EN_CURSO">En curso</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <button
          type="button"
          onClick={() => setFilterStatus("")}
          className="text-primary text-xs hover:underline"
        >
          Limpiar filtros
        </button>
      </div>

      {error && <p className="text-error mb-4">{error}</p>}
      {loading ? (
        <p className="text-on-surface-variant">Cargando...</p>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-sm text-on-surface-variant">Nombre</th>
                  <th className="px-6 py-4 text-sm text-on-surface-variant">Estado</th>
                  <th className="px-6 py-4 text-sm text-on-surface-variant">Fecha</th>
                  <th className="px-6 py-4 text-sm text-on-surface-variant">Dueño</th>
                  <th className="px-6 py-4 text-sm text-on-surface-variant text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low/30">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          to={`/projects/${p.id}`}
                          className="font-bold hover:text-primary"
                        >
                          {p.name}
                        </Link>
                        {isProjectOverdue(p) && <OverdueBadge />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ProjectStatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p>{formatDate(p.startDate)}</p>
                      <p className="text-outline">{formatDate(p.endDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {p.dueno && (
                        <div className="flex items-center gap-2">
                          <Avatar name={p.dueno.name} className="w-6 h-6 text-xs" />
                          <span className="text-sm">{p.dueno.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/projects/${p.id}`} className="text-primary text-sm hover:underline">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="p-8 text-center text-on-surface-variant">No hay proyectos</p>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          orgs={orgs}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateProjectModal({
  orgs,
  onClose,
  onCreated,
}: {
  orgs: Organization[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("PLANIFICADO");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await projectsApi.create({
        name,
        description,
        status,
        startDate: startDate || null,
        endDate: endDate || null,
        organizationId: organizationId || null,
      });
      onCreated();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Nuevo proyecto" onClose={onClose} wide>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-error text-sm">{error}</p>}
        <input
          required
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-outline-variant rounded-lg px-4 py-2"
        />
        <textarea
          required
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-outline-variant rounded-lg px-4 py-2 min-h-[80px]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          className="w-full border border-outline-variant rounded-lg px-4 py-2"
        >
          <option value="PLANIFICADO">Planificado</option>
          <option value="EN_CURSO">En curso</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-outline-variant rounded-lg px-4 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-outline-variant rounded-lg px-4 py-2"
          />
        </div>
        <select
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          className="w-full border border-outline-variant rounded-lg px-4 py-2"
        >
          <option value="">Sin organización</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-medium"
        >
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>
    </Modal>
  );
}
