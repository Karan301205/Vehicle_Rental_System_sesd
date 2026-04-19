import { AppError } from "../../utils/app-error.js";
import { BookingStatus } from "../enums/booking-status.js";

export class Booking {
  constructor({
    id,
    userId,
    vehicleId,
    startTime,
    endTime,
    totalAmount,
    status = BookingStatus.PENDING,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.vehicleId = vehicleId;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.totalAmount = Number(totalAmount);
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  confirm() {
    if (this.status !== BookingStatus.PENDING) {
      throw new AppError("Only pending bookings can be confirmed", 409);
    }

    this.status = BookingStatus.CONFIRMED;
  }

  cancel() {
    if (![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(this.status)) {
      throw new AppError("Only pending or confirmed bookings can be cancelled", 409);
    }

    this.status = BookingStatus.CANCELLED;
  }

  complete() {
    if (this.status !== BookingStatus.ACTIVE) {
      throw new AppError("Only active bookings can be completed", 409);
    }

    this.status = BookingStatus.COMPLETED;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      vehicleId: this.vehicleId,
      startTime: this.startTime,
      endTime: this.endTime,
      totalAmount: this.totalAmount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

