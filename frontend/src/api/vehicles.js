import { apiRequest } from "./client.js";

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function fetchVehicles(filters = {}) {
  return apiRequest(`/vehicles${buildQuery(filters)}`);
}

export function searchAvailableVehicles(filters = {}) {
  return apiRequest(`/vehicles/search${buildQuery(filters)}`);
}

export function fetchVehicleById(id) {
  return apiRequest(`/vehicles/${id}`);
}

export function createVehicle(payload, token) {
  return apiRequest("/vehicles", {
    method: "POST",
    token,
    body: payload
  });
}

