export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value ?? 0));
}

export function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatVehicleType(type) {
  return type === "CAR" ? "Car" : "Bike";
}

export function getBookingStatusTone(status) {
  const tones = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    ACTIVE: "bg-sky-100 text-sky-700",
    COMPLETED: "bg-stone-200 text-stone-700",
    CANCELLED: "bg-rose-100 text-rose-700"
  };

  return tones[status] ?? "bg-stone-100 text-stone-700";
}

