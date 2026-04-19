import { Booking } from "../../domain/entities/Booking.js";
import { User } from "../../domain/entities/User.js";
import { VehicleFactory } from "../../domain/entities/VehicleFactory.js";

export function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return new User({
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    fullName: row.full_name,
    role: row.role,
    licenseNumber: row.license_number,
    isActive: row.is_active,
    createdAt: row.created_at
  });
}

export function mapVehicleRow(row) {
  if (!row) {
    return null;
  }

  return VehicleFactory.create({
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    plateNumber: row.plate_number,
    type: row.type,
    status: row.status,
    baseRatePerHour: row.base_rate_per_hour,
    specificAttributes: row.specific_attributes ?? {},
    imageUrl: row.image_url,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

export function mapBookingRow(row) {
  if (!row) {
    return null;
  }

  return new Booking({
    id: row.id,
    userId: row.user_id,
    vehicleId: row.vehicle_id,
    startTime: row.start_time,
    endTime: row.end_time,
    totalAmount: row.total_amount,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

