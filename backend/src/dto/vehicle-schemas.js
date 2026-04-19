import { z } from "zod";
import { VehicleStatus } from "../domain/enums/vehicle-status.js";
import { VehicleType } from "../domain/enums/vehicle-type.js";

const carAttributesSchema = z.object({
  trunkSize: z.number().nonnegative().optional(),
  doors: z.number().int().min(2).max(6).optional(),
  hasAC: z.boolean().optional()
});

const bikeAttributesSchema = z.object({
  helmetType: z.string().min(2).optional(),
  engineCapacity: z.number().int().positive().optional()
});

const specificAttributesSchema = z.union([carAttributesSchema, bikeAttributesSchema]);

export const createVehicleSchema = z.object({
  body: z.object({
    brand: z.string().min(2),
    model: z.string().min(1),
    year: z.number().int().min(1900),
    plateNumber: z.string().min(3),
    type: z.nativeEnum(VehicleType),
    status: z.nativeEnum(VehicleStatus).optional(),
    baseRatePerHour: z.number().nonnegative(),
    specificAttributes: specificAttributesSchema.default({}),
    imageUrl: z.string().url().optional()
  })
});

export const updateVehicleSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    brand: z.string().min(2),
    model: z.string().min(1),
    year: z.number().int().min(1900),
    plateNumber: z.string().min(3),
    type: z.nativeEnum(VehicleType),
    status: z.nativeEnum(VehicleStatus),
    baseRatePerHour: z.number().nonnegative(),
    specificAttributes: specificAttributesSchema.default({}),
    imageUrl: z.string().url().nullable().optional()
  })
});

export const vehicleFilterSchema = z.object({
  query: z.object({
    type: z.nativeEnum(VehicleType).optional(),
    status: z.nativeEnum(VehicleStatus).optional(),
    brand: z.string().optional(),
    minRate: z.coerce.number().nonnegative().optional(),
    maxRate: z.coerce.number().nonnegative().optional()
  })
});

