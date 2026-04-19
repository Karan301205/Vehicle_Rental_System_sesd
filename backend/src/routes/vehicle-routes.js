import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController.js";
import { vehicleFilterSchema, createVehicleSchema, updateVehicleSchema } from "../dto/vehicle-schemas.js";
import { UserRole } from "../domain/enums/user-role.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/require-role.js";
import { validateRequest } from "../middleware/validate-request.js";
import { asyncHandler } from "../utils/async-handler.js";

export function createVehicleRoutes(vehicleService) {
  const router = Router();
  const controller = new VehicleController(vehicleService);

  router.get("/", validateRequest(vehicleFilterSchema), asyncHandler(controller.list));
  router.get("/search", validateRequest(vehicleFilterSchema), asyncHandler(controller.searchAvailable));
  router.get("/:id", asyncHandler(controller.getById));
  router.post(
    "/",
    authenticate,
    requireRole(UserRole.ADMIN),
    validateRequest(createVehicleSchema),
    asyncHandler(controller.create)
  );
  router.patch(
    "/:id",
    authenticate,
    requireRole(UserRole.ADMIN),
    validateRequest(updateVehicleSchema),
    asyncHandler(controller.update)
  );
  router.delete("/:id", authenticate, requireRole(UserRole.ADMIN), asyncHandler(controller.remove));

  return router;
}

