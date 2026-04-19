import { AppError } from "../../utils/app-error.js";
import { VehicleStatus } from "../enums/vehicle-status.js";

export class Vehicle {
  constructor({
    id,
    brand,
    model,
    year,
    plateNumber,
    type,
    status = VehicleStatus.AVAILABLE,
    baseRatePerHour,
    specificAttributes = {},
    imageUrl,
    isActive = true,
    createdAt,
    updatedAt
  }) {
    if (new.target === Vehicle) {
      throw new AppError("Vehicle is abstract and cannot be instantiated directly", 500);
    }

    this.id = id;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.plateNumber = plateNumber;
    this.type = type;
    this.status = status;
    this.baseRatePerHour = Number(baseRatePerHour);
    this.specificAttributes = specificAttributes;
    this.imageUrl = imageUrl;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markAsRented() {
    this.status = VehicleStatus.RENTED;
  }

  markAsAvailable() {
    this.status = VehicleStatus.AVAILABLE;
  }

  ensureBookable() {
    if (!this.isActive || this.status !== VehicleStatus.AVAILABLE) {
      throw new AppError("Vehicle is not available for booking", 409);
    }
  }

  getDisplayName() {
    return `${this.brand} ${this.model}`;
  }

  getHourlyBaseAmount(hours) {
    return this.baseRatePerHour * hours;
  }

  calculateRentalCost(_hours) {
    throw new AppError("Subclasses must implement calculateRentalCost", 500);
  }

  toJSON() {
    return {
      id: this.id,
      brand: this.brand,
      model: this.model,
      year: this.year,
      plateNumber: this.plateNumber,
      type: this.type,
      status: this.status,
      baseRatePerHour: this.baseRatePerHour,
      specificAttributes: this.specificAttributes,
      imageUrl: this.imageUrl,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

