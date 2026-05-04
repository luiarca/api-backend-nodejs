import { apiPost } from "./api";

export function loginRequest(credentials) {
  return apiPost("/login", credentials);
}

export function registerRequest(payload) {
  return apiPost("/register", payload);
}
