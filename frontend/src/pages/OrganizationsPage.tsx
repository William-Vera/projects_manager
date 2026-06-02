import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Modal } from "../components/ui/Modal";
import { organizationsApi } from "../api/organizations.api";
import type { Organization } from "../types";
import { formatDate } from "../utils/projectStatus";
import { getApiErrorMessage } from "../utils/apiError";
import { useAuthStore } from "../store/authStore";

export function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const userId = useAuthStore((s) => s.user?.id);

  const load = () => {
    organizationsApi
      .list()
      .then(({ data }) => setOrgs(data))
      .catch((err) => setError(getApiErrorMessage(err)));
  };

  useEffect(() => {
    load();
  }, []);

  const getMyRole = (org: Organization): string => {
    const m = org.members?.find((x) => x.userId === userId);
    return m?.role ?? "MEMBER";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-semibold mb-1">Tus espacios de trabajo</h3>
          <p className="text-on-surface-variant">
            Administra y colabora en múltiples ecosistemas empresariales.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-md"
        >
          <Icon name="add_circle" filled />
          Crear organización
        </button>
      </div>

      {error && <p className="text-error mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orgs.map((org) => (
          <div
            key={org.id}
            className="glass-card border border-outline-variant rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container">
                  <Icon name="corporate_fare" className="text-3xl" />
                </div>
                <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {getMyRole(org)}
                </span>
              </div>
              <h4 className="text-xl font-semibold mb-1">{org.name}</h4>
              <p className="text-sm text-on-surface-variant mb-4">
                {org.members?.length ?? 0} miembros · {org.projects?.length ?? 0} proyectos
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-outline-variant pt-4">
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <Icon name="calendar_today" className="text-lg" />
                {formatDate(org.createdAt)}
              </div>
              <Link
                to={`/organizations/${org.id}`}
                className="text-primary text-sm flex items-center gap-1 hover:underline"
              >
                Ver detalle
                <Icon name="chevron_right" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {orgs.length === 0 && !error && (
        <p className="text-center text-on-surface-variant py-12">No tienes organizaciones</p>
      )}

      {showModal && (
        <CreateOrgModal
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

function CreateOrgModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await organizationsApi.create({ name });
      onCreated();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Nueva organización" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-error text-sm">{error}</p>}
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la organización"
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg"
        >
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>
    </Modal>
  );
}
