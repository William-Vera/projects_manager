import api from "./axios";
import type { Notification } from "../types";

export const notificationsApi = {
  list: () => api.get<Notification[]>("/notifications"),

  markRead: (id: string) => api.patch<Notification>(`/notifications/${id}/read`),

  markAllRead: () => api.patch("/notifications/read-all"),
};
