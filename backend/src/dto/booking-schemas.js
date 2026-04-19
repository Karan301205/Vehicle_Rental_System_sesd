import { z } from "zod";
import { BookingStatus } from "../domain/enums/booking-status.js";

export const createBookingSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime()
  })
});

export const bookingIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const bookingFilterSchema = z.object({
  query: z.object({
    status: z.nativeEnum(BookingStatus).optional()
  })
});

