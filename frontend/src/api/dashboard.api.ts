import api from "./axios";
import type { DashboardMetrics } from "../types";

export const dashboardApi = {
  metrics: () => api.get<DashboardMetrics>("/dashboard/metrics"),
};
