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

export function createBooking(payload, token) {
  return apiRequest("/bookings", {
    method: "POST",
    token,
    body: payload
  });
}

export function fetchMyBookings(token) {
  return apiRequest("/bookings/me", { token });
}

export function cancelBooking(id, token) {
  return apiRequest(`/bookings/${id}/cancel`, {
    method: "PATCH",
    token
  });
}

export function fetchAllBookings(token, filters = {}) {
  return apiRequest(`/admin/bookings${buildQuery(filters)}`, { token });
}

export function approveBooking(id, token) {
  return apiRequest(`/admin/bookings/${id}/approve`, {
    method: "PATCH",
    token
  });
}

