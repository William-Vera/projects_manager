import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Modal } from "../components/ui/Modal";
import { Avatar } from "../components/ui/Avatar";
import { organizationsApi } from "../api/organizations.api";
import type { Organization, OrganizationRole } from "../types";
import { getApiErrorMessage } from "../utils/apiError";
import { useAuthStore } from "../store/authStore";

type Tab = "members" | "projects";

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [tab, setTab] = useState<Tab>("members");
  const [showInvite, setShowInvite] = useState(false);
  const [error, setError] = useState("");
  const userId = useAuthStore((s) => s.user?.id);

  const load = () => {
    if (!id) return;
    organizationsApi
      .getById(id)
      .then(({ data }) => setOrg(data))
      .catch((err) => setError(getApiErrorMessage(err)));
  };

  useEffect(() => {
    load();
  }, [id]);

  const myMembership = org?.members?.find((m) => m.userId === userId);
  const canInvite =
    myMembership?.role === "OWNER" || myMembership?.role === "ADMIN";

  const handleRemoveMember = async (memberUserId: string) => {
    if (!id || !confirm("¿Quitar este miembro?")) return;
    try {
      await organizationsApi.removeMember(id, memberUserId);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (error) return <p className="text-error">{error}</p>;
  if (!org) return <p className="text-on-surface-variant">Cargando...</p>;

  return (
    <div className="space-y-6">
      <Link
        to="/organizations"
        className="text-primary text-sm flex items-center gap-1 hover:underline"
      >
        <Icon name="arrow_back" />
        Organizaciones
      </Link>

      <div className="relative overflow-hidden rounded-2xl h-40 flex items-end bg-gradient-to-r from-primary to-primary-container">
        <div className="relative p-8 flex items-center gap-6 w-full bg-gradient-to-t from-black/40 to-transparent">
          <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl flex items-center justify-center">
            <Icon name="corporate_fare" className="text-4xl text-primary" />
          </div>
          <div className="text-white flex-1">
            <h1 className="text-3xl font-bold mb-1">{org.name}</h1>
            {org.owner && (
              <p className="text-sm opacity-90 flex items-center gap-1">
                <Icon name="person" className="text-sm" />
                Propietario: {org.owner.name}
              </p>
            )}
          </div>
          {canInvite && (
            <button
              type="button"
              onClick={() => setShowInvite(true)}
              className="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <Icon name="person_add" />
              Invitar miembro
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-outline-variant flex gap-8">
        {(["members", "projects"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`pb-4 px-2 font-medium capitalize ${
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-on-surface-variant"
            }`}
          >
            {t === "members" ? "Miembros" : "Proyectos"}
          </button>
        ))}
      </div>

      {tab === "members" && (
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b">
                <th className="px-6 py-4 text-sm uppercase text-on-surface-variant">Nombre</th>
                <th className="px-6 py-4 text-sm uppercase text-on-surface-variant">Email</th>
                <th className="px-6 py-4 text-sm uppercase text-on-surface-variant">Rol</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {org.members?.map((m) => (
                <tr key={m.id} className="hover:bg-surface-container-low">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.user?.name ?? "?"} />
                      <span className="font-semibold">{m.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{m.user?.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {m.role !== "OWNER" && canInvite && m.userId !== userId && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.userId)}
                        className="text-error text-sm hover:underline"
                      >
                        Quitar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "projects" && (
        <div className="grid gap-4">
          {org.projects?.length ? (
            org.projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="block p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary"
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-on-surface-variant">{p.description}</p>
              </Link>
            ))
          ) : (
            <p className="text-on-surface-variant">Sin proyectos en esta organización</p>
          )}
        </div>
      )}

      {showInvite && id && (
        <InviteModal
          orgId={id}
          onClose={() => setShowInvite(false)}
          onInvited={() => {
            setShowInvite(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function InviteModal({
  orgId,
  onClose,
  onInvited,
}: {
  orgId: string;
  onClose: () => void;
  onInvited: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrganizationRole>("MEMBER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await organizationsApi.addMember(orgId, { email, role });
      onInvited();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Invitar miembro" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-error text-sm">{error}</p>}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@empresa.com"
          className="w-full border rounded-lg px-4 py-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as OrganizationRole)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="MEMBER">Miembro</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg"
        >
          {loading ? "Enviando..." : "Invitar"}
        </button>
      </form>
    </Modal>
  );
}
