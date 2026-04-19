import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { createApp } from "../app.js";

test("WheelCheck API supports customer booking flow and admin approval", async () => {
  const app = await createApp();

  const healthResponse = await request(app).get("/health");
  assert.equal(healthResponse.status, 200);

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "admin@wheelcheck.dev",
    password: "secret123"
  });
  assert.equal(loginResponse.status, 200);
  const adminToken = loginResponse.body.token;

  const registerResponse = await request(app).post("/api/auth/register").send({
    fullName: "Integration Customer",
    email: "flow.customer@example.com",
    password: "secret123",
    licenseNumber: "FLOW12345"
  });
  assert.equal(registerResponse.status, 201);
  const customerToken = registerResponse.body.token;

  const vehiclesResponse = await request(app).get("/api/vehicles/search");
  assert.equal(vehiclesResponse.status, 200);
  assert.ok(vehiclesResponse.body.vehicles.length > 0);
  const vehicleId = vehiclesResponse.body.vehicles[0].id;

  const bookingResponse = await request(app)
    .post("/api/bookings")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      vehicleId,
      startTime: "2026-04-21T10:00:00.000Z",
      endTime: "2026-04-21T14:00:00.000Z"
    });
  assert.equal(bookingResponse.status, 201);
  assert.equal(bookingResponse.body.booking.status, "PENDING");

  const bookingId = bookingResponse.body.booking.id;

  const approveResponse = await request(app)
    .patch(`/api/admin/bookings/${bookingId}/approve`)
    .set("Authorization", `Bearer ${adminToken}`);
  assert.equal(approveResponse.status, 200);
  assert.equal(approveResponse.body.booking.status, "CONFIRMED");

  const myBookingsResponse = await request(app)
    .get("/api/bookings/me")
    .set("Authorization", `Bearer ${customerToken}`);
  assert.equal(myBookingsResponse.status, 200);
  assert.ok(myBookingsResponse.body.bookings.some((booking) => booking.id === bookingId));
});
