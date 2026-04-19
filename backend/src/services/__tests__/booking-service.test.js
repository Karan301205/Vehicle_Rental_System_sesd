import assert from "node:assert/strict";
import test from "node:test";
import { BookingStatus } from "../../domain/enums/booking-status.js";
import { VehicleStatus } from "../../domain/enums/vehicle-status.js";
import { VehicleType } from "../../domain/enums/vehicle-type.js";
import { Car } from "../../domain/entities/Car.js";
import { BookingService } from "../BookingService.js";

function createCar(overrides = {}) {
  return new Car({
    id: "vehicle-1",
    brand: "Audi",
    model: "A4",
    year: 2024,
    plateNumber: "ABC1234",
    type: VehicleType.CAR,
    status: VehicleStatus.AVAILABLE,
    baseRatePerHour: 20,
    specificAttributes: { hasAC: true, doors: 4 },
    isActive: true,
    ...overrides
  });
}

test("BookingService creates a pending booking with calculated total", async () => {
  const vehicleRepository = {
    async findById() {
      return createCar();
    },
    async updateStatus() {
      return null;
    }
  };

  const bookingRepository = {
    async hasConflict() {
      return false;
    },
    async create(payload) {
      return {
        ...payload,
        id: "booking-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  };

  const service = new BookingService(bookingRepository, vehicleRepository);
  const booking = await service.createBooking({
    userId: "user-1",
    vehicleId: "vehicle-1",
    startTime: "2026-04-20T10:00:00.000Z",
    endTime: "2026-04-20T13:00:00.000Z"
  });

  assert.equal(booking.status, BookingStatus.PENDING);
  assert.equal(booking.totalAmount, 63.75);
});

test("BookingService rejects overlapping bookings", async () => {
  const vehicleRepository = {
    async findById() {
      return createCar();
    }
  };

  const bookingRepository = {
    async hasConflict() {
      return true;
    }
  };

  const service = new BookingService(bookingRepository, vehicleRepository);

  await assert.rejects(
    () =>
      service.createBooking({
        userId: "user-1",
        vehicleId: "vehicle-1",
        startTime: "2026-04-20T10:00:00.000Z",
        endTime: "2026-04-20T11:00:00.000Z"
      }),
    /already booked/
  );
});

test("BookingService confirms a pending booking and updates the vehicle status", async () => {
  const updatedStatuses = [];
  const vehicleRepository = {
    async updateStatus(vehicleId, status) {
      updatedStatuses.push({ vehicleId, status });
    }
  };

  const bookingRepository = {
    async findById() {
      return {
        id: "booking-1",
        vehicleId: "vehicle-1",
        status: BookingStatus.PENDING,
        confirm() {
          this.status = BookingStatus.CONFIRMED;
        }
      };
    },
    async updateStatus(id, status) {
      return { id, vehicleId: "vehicle-1", status };
    }
  };

  const service = new BookingService(bookingRepository, vehicleRepository);
  const booking = await service.approveBooking("booking-1");

  assert.equal(booking.status, BookingStatus.CONFIRMED);
  assert.deepEqual(updatedStatuses[0], { vehicleId: "vehicle-1", status: VehicleStatus.RENTED });
});

