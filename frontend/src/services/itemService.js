import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export function getItems(token) {
  return apiGet("/api/items", token);
}

export function getItemById(id, token) {
  return apiGet(`/api/items/${id}`, token);
}

export function createItem(payload, token) {
  return apiPost("/api/items", payload, token);
}

export function updateItem(id, payload, token) {
  return apiPut(`/api/items/${id}`, payload, token);
}

export function deleteItem(id, token) {
  return apiDelete(`/api/items/${id}`, token);
}
