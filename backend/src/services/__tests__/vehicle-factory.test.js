import assert from "node:assert/strict";
import test from "node:test";
import { VehicleFactory } from "../../domain/entities/VehicleFactory.js";
import { VehicleType } from "../../domain/enums/vehicle-type.js";

test("VehicleFactory returns a Car entity for CAR type", () => {
  const vehicle = VehicleFactory.create({
    id: "vehicle-1",
    brand: "Tesla",
    model: "Model 3",
    year: 2025,
    plateNumber: "TES123",
    type: VehicleType.CAR,
    baseRatePerHour: 30,
    specificAttributes: { hasAC: true, doors: 4 }
  });

  assert.equal(vehicle.constructor.name, "Car");
  assert.equal(vehicle.calculateRentalCost(2), 62.5);
});
