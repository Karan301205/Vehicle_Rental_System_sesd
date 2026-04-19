import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatCurrency, formatVehicleType } from "../../lib/formatters.js";

function vehicleImageForType(type) {
  if (type === "BIKE") {
    return "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80";
  }

  return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80";
}

export function VehicleCard({ vehicle }) {
  const imageUrl = vehicle.imageUrl || vehicleImageForType(vehicle.type);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-[28px] border border-line bg-panel shadow-card"
    >
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        <img src={imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{formatVehicleType(vehicle.type)}</p>
            <h3 className="mt-2 text-xl font-semibold">{vehicle.brand} {vehicle.model}</h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{formatCurrency(vehicle.baseRatePerHour)}</p>
            <p className="text-xs text-muted">per hour</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-full bg-stone-100 px-3 py-1">{vehicle.year}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{vehicle.status}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{vehicle.plateNumber}</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link to={`/bookings/new?vehicleId=${vehicle.id}`} className="text-sm font-medium text-accent">
            Review availability
          </Link>
          <Link
            to={`/bookings/new?vehicleId=${vehicle.id}`}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Book now
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

