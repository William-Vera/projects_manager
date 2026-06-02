import { useEffect, useState } from "react";
import { Icon } from "../components/ui/Icon";
import { notificationsApi } from "../api/notifications.api";
import type { Notification } from "../types";
import { formatRelativeTime } from "../utils/projectStatus";
import { getApiErrorMessage } from "../utils/apiError";

export function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    notificationsApi
      .list()
      .then(({ data }) => setItems(data))
      .catch((err) => setError(getApiErrorMessage(err)));
  };

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    try {
      await notificationsApi.markAllRead();
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const markOne = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const unread = items.filter((n) => !n.read);
  const read = items.filter((n) => n.read);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-semibold">Notificaciones</h3>
          <p className="text-on-surface-variant">
            Mantente al día con los cambios en tus proyectos y tareas.
          </p>
        </div>
        {unread.length > 0 && (
          <button
            type="button"
            onClick={markAll}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-xl text-sm shadow-md"
          >
            <Icon name="done_all" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {error && <p className="text-error mb-4">{error}</p>}

      <div className="space-y-8">
        {unread.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Sin leer</h4>
              <div className="h-px flex-1 bg-outline-variant" />
            </div>
            <div className="space-y-2">
              {unread.map((n) => (
                <NotificationItem key={n.id} item={n} onRead={() => markOne(n.id)} />
              ))}
            </div>
          </section>
        )}

        {read.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-4">
              <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Leídas
              </h4>
              <div className="h-px flex-1 bg-outline-variant" />
            </div>
            <div className="space-y-2">
              {read.map((n) => (
                <NotificationItem key={n.id} item={n} onRead={() => markOne(n.id)} />
              ))}
            </div>
          </section>
        )}

        {items.length === 0 && !error && (
          <p className="text-center text-on-surface-variant py-12">No hay notificaciones</p>
        )}
      </div>
    </div>
  );
}

function NotificationItem({
  item,
  onRead,
}: {
  item: Notification;
  onRead: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRead}
      className={`w-full text-left flex items-start gap-4 p-4 border border-outline-variant rounded-xl hover:bg-surface transition-colors relative ${
        !item.read ? "bg-surface-container-lowest" : "opacity-80"
      }`}
    >
      {!item.read && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0 ml-2">
        <Icon name="assignment" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <p className="font-bold text-sm truncate">Notificación</p>
          <span className="text-xs text-on-surface-variant whitespace-nowrap">
            {formatRelativeTime(item.createdAt)}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{item.message}</p>
      </div>
    </button>
  );
}
