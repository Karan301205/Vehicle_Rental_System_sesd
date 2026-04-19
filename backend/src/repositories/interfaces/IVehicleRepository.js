export class IVehicleRepository {
  async create(_vehicleData) {
    throw new Error("create must be implemented");
  }

  async update(_id, _vehicleData) {
    throw new Error("update must be implemented");
  }

  async findById(_id) {
    throw new Error("findById must be implemented");
  }

  async searchAvailable(_filters) {
    throw new Error("searchAvailable must be implemented");
  }

  async listAll(_filters) {
    throw new Error("listAll must be implemented");
  }

  async updateStatus(_id, _status) {
    throw new Error("updateStatus must be implemented");
  }

  async softDelete(_id) {
    throw new Error("softDelete must be implemented");
  }
}

