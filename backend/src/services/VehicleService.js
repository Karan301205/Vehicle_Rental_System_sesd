import { VehicleFactory } from "../domain/entities/VehicleFactory.js";
import { VehicleStatus } from "../domain/enums/vehicle-status.js";
import { AppError } from "../utils/app-error.js";

export class VehicleService {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async addVehicle(vehicleData) {
    const vehicle = VehicleFactory.create({
      ...vehicleData,
      status: vehicleData.status ?? VehicleStatus.AVAILABLE
    });

    return this.vehicleRepository.create(vehicle.toJSON());
  }

  async updateVehicle(id, vehicleData) {
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    const mergedVehicle = VehicleFactory.create({
      ...existingVehicle.toJSON(),
      ...vehicleData,
      specificAttributes: vehicleData.specificAttributes ?? existingVehicle.specificAttributes
    });

    return this.vehicleRepository.update(id, mergedVehicle.toJSON());
  }

  async deleteVehicle(id) {
    const vehicle = await this.vehicleRepository.softDelete(id);
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    return { success: true };
  }

  async getVehicleById(id) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    return vehicle;
  }

  async listVehicles(filters) {
    return this.vehicleRepository.listAll(filters);
  }

  async searchAvailableVehicles(filters) {
    return this.vehicleRepository.searchAvailable(filters);
  }
}

