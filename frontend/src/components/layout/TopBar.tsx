import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "../ui/Icon";
import { useAuthStore } from "../../store/authStore";
import { notificationsApi } from "../../api/notifications.api";

export function TopBar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick?: () => void;
}) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    notificationsApi
      .list()
      .then(({ data }) => setUnread(data.filter((n) => !n.read).length))
      .catch(() => setUnread(0));
  }, [title]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="flex justify-between items-center px-6 h-16 sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant w-full md:w-[calc(100%-260px)] md:ml-[260px]"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="md:hidden p-2 text-on-surface"
          onClick={onMenuClick}
        >
          <Icon name="menu" />
        </button>
        <h2 className="text-xl font-black text-primary">{title}</h2>
      </div>
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="relative p-2 text-on-surface-variant hover:text-primary"
          onClick={() => navigate("/notifications")}
        >
          <Icon name="notifications" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest" />
          )}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-on-surface-variant hover:text-primary shrink-0 whitespace-nowrap"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
