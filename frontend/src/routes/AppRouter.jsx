import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ItemsPage } from "../pages/ItemsPage";
import { ItemDetailPage } from "../pages/ItemDetailPage";
import { ItemFormPage } from "../pages/ItemFormPage";
import { UsersPage } from "../pages/UsersPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
        </Route>
      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}
      >
        <Route element={<AppLayout />}>
          <Route path="/items/new" element={<ItemFormPage mode="create" />} />
          <Route path="/items/:id/edit" element={<ItemFormPage mode="edit" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
