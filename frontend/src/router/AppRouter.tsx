import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { OrganizationsPage } from "../pages/OrganizationsPage";
import { OrganizationDetailPage } from "../pages/OrganizationDetailPage";
import { TaskDetailPage } from "../pages/TaskDetailPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { ProfilePage } from "../pages/ProfilePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
