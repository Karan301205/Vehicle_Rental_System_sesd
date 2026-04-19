import { BookingStatus } from "../domain/enums/booking-status.js";
import { VehicleStatus } from "../domain/enums/vehicle-status.js";
import { StandardPricingStrategy } from "../domain/strategies/StandardPricingStrategy.js";
import { SurgePricingStrategy } from "../domain/strategies/SurgePricingStrategy.js";
import { AppError } from "../utils/app-error.js";

function calculateDurationHours(startTime, endTime) {
  const milliseconds = new Date(endTime).getTime() - new Date(startTime).getTime();
  return Math.ceil(milliseconds / (1000 * 60 * 60));
}

function isWeekend(dateValue) {
  const day = new Date(dateValue).getUTCDay();
  return day === 0 || day === 6;
}

export class BookingService {
  constructor(bookingRepository, vehicleRepository) {
    this.bookingRepository = bookingRepository;
    this.vehicleRepository = vehicleRepository;
    this.standardPricingStrategy = new StandardPricingStrategy();
    this.surgePricingStrategy = new SurgePricingStrategy(1.25);
  }

  async createBooking({ userId, vehicleId, startTime, endTime }) {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    vehicle.ensureBookable();

    const hours = calculateDurationHours(startTime, endTime);
    if (hours <= 0) {
      throw new AppError("Booking time range is invalid", 400);
    }

    const hasConflict = await this.bookingRepository.hasConflict(vehicleId, startTime, endTime);
    if (hasConflict) {
      throw new AppError("Vehicle is already booked for the selected time range", 409);
    }

    const baseAmount = vehicle.calculateRentalCost(hours);
    const pricingStrategy = isWeekend(startTime) ? this.surgePricingStrategy : this.standardPricingStrategy;
    const totalAmount = pricingStrategy.calculatePrice(baseAmount);

    return this.bookingRepository.create({
      userId,
      vehicleId,
      startTime,
      endTime,
      totalAmount,
      status: BookingStatus.PENDING
    });
  }

  async getUserBookings(userId) {
    return this.bookingRepository.findByUserId(userId);
  }

  async listAllBookings(filters) {
    return this.bookingRepository.listAll(filters);
  }

  async approveBooking(bookingId) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    booking.confirm();
    const updatedBooking = await this.bookingRepository.updateStatus(bookingId, booking.status);
    await this.vehicleRepository.updateStatus(updatedBooking.vehicleId, VehicleStatus.RENTED);

    return updatedBooking;
  }

  async cancelBooking(bookingId, userId) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.userId !== userId) {
      throw new AppError("You can only cancel your own bookings", 403);
    }

    booking.cancel();
    return this.bookingRepository.updateStatus(bookingId, booking.status);
  }
}

