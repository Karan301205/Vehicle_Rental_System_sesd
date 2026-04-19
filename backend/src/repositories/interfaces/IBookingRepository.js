export class IBookingRepository {
  async create(_bookingData) {
    throw new Error("create must be implemented");
  }

  async findById(_id) {
    throw new Error("findById must be implemented");
  }

  async findByUserId(_userId) {
    throw new Error("findByUserId must be implemented");
  }

  async listAll(_filters) {
    throw new Error("listAll must be implemented");
  }

  async updateStatus(_id, _status) {
    throw new Error("updateStatus must be implemented");
  }

  async hasConflict(_vehicleId, _startTime, _endTime) {
    throw new Error("hasConflict must be implemented");
  }
}

