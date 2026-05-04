const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

async function request(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders
    }
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.mensaje
        ? payload.mensaje
        : "Ocurrio un error al consumir la API";
    throw new Error(message);
  }

  return payload;
}

export function apiGet(path, token) {
  return request(path, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}

export function apiPost(path, body, token) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}

export function apiPut(path, body, token) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}

export function apiDelete(path, token) {
  return request(path, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}
