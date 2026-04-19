export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const USER_ROLES = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER"
};

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

export const VEHICLE_TYPE = {
  CAR: "CAR",
  BIKE: "BIKE"
};

