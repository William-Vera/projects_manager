import api from "./axios";
import type { JwtProfile, User } from "../types";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<User>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>("/auth/login", data),

  profile: () => api.get<JwtProfile>("/auth/profile"),
};
