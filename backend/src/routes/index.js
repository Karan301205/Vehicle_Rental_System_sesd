import { Router } from "express";
import { db, initializeDatabase } from "../config/database.js";
import { PostgresBookingRepository } from "../repositories/postgres/PostgresBookingRepository.js";
import { PostgresUserRepository } from "../repositories/postgres/PostgresUserRepository.js";
import { PostgresVehicleRepository } from "../repositories/postgres/PostgresVehicleRepository.js";
import { AuthService } from "../services/AuthService.js";
import { BookingService } from "../services/BookingService.js";
import { VehicleService } from "../services/VehicleService.js";
import { createAdminRoutes } from "./admin-routes.js";
import { createAuthRoutes } from "./auth-routes.js";
import { createBookingRoutes } from "./booking-routes.js";
import { createVehicleRoutes } from "./vehicle-routes.js";

export async function createApiRouter() {
  await initializeDatabase();

  const userRepository = new PostgresUserRepository(db);
  const vehicleRepository = new PostgresVehicleRepository(db);
  const bookingRepository = new PostgresBookingRepository(db);

  const authService = new AuthService(userRepository);
  const vehicleService = new VehicleService(vehicleRepository);
  const bookingService = new BookingService(bookingRepository, vehicleRepository);

  const apiRouter = Router();

  apiRouter.get("/", (_request, response) => {
    response.status(200).json({
      name: "WheelCheck API",
      version: "v1",
      message: "Backend services are active"
    });
  });

  apiRouter.use("/auth", createAuthRoutes(authService));
  apiRouter.use("/vehicles", createVehicleRoutes(vehicleService));
  apiRouter.use("/bookings", createBookingRoutes(bookingService));
  apiRouter.use("/admin", createAdminRoutes(bookingService));

  return apiRouter;
}
