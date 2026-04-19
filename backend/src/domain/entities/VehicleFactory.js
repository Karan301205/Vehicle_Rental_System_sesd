import { AppError } from "../../utils/app-error.js";
import { VehicleType } from "../enums/vehicle-type.js";
import { Bike } from "./Bike.js";
import { Car } from "./Car.js";

export class VehicleFactory {
  static create(vehicleData) {
    switch (vehicleData.type) {
      case VehicleType.CAR:
        return new Car(vehicleData);
      case VehicleType.BIKE:
        return new Bike(vehicleData);
      default:
        throw new AppError(`Unsupported vehicle type: ${vehicleData.type}`, 400);
    }
  }
}

