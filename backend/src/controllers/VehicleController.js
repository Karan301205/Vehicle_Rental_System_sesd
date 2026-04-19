export class VehicleController {
  constructor(vehicleService) {
    this.vehicleService = vehicleService;
  }

  list = async (request, response) => {
    const vehicles = await this.vehicleService.listVehicles(request.validated?.query ?? {});
    response.status(200).json({ vehicles: vehicles.map((vehicle) => vehicle.toJSON()) });
  };

  searchAvailable = async (request, response) => {
    const vehicles = await this.vehicleService.searchAvailableVehicles(request.validated.query);
    response.status(200).json({ vehicles: vehicles.map((vehicle) => vehicle.toJSON()) });
  };

  getById = async (request, response) => {
    const vehicle = await this.vehicleService.getVehicleById(request.params.id);
    response.status(200).json({ vehicle: vehicle.toJSON() });
  };

  create = async (request, response) => {
    const vehicle = await this.vehicleService.addVehicle(request.validated.body);
    response.status(201).json({ vehicle: vehicle.toJSON() });
  };

  update = async (request, response) => {
    const vehicle = await this.vehicleService.updateVehicle(request.validated.params.id, request.validated.body);
    response.status(200).json({ vehicle: vehicle.toJSON() });
  };

  remove = async (request, response) => {
    const result = await this.vehicleService.deleteVehicle(request.params.id);
    response.status(200).json(result);
  };
}

