import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export function getUsers(token) {
  return apiGet("/api/admin/users", token);
}

export function createManagedUser(payload, token) {
  return apiPost("/api/admin/users", payload, token);
}

export function updateUserRole(id, payload, token) {
  return apiPut(`/api/admin/users/${id}/role`, payload, token);
}

export function deleteUser(id, token) {
  return apiDelete(`/api/admin/users/${id}`, token);
}
