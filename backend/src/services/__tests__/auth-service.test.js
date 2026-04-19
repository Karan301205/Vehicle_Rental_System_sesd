import assert from "node:assert/strict";
import test from "node:test";
import { AuthService } from "../AuthService.js";

process.env.NODE_ENV = "test";
process.env.PORT = "4000";
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/wheelcheck";
process.env.JWT_SECRET = "abcdefghijklmnop";
process.env.JWT_EXPIRES_IN = "7d";
process.env.CLIENT_URL = "http://localhost:5173";

test("AuthService registers a new customer and returns a token", async () => {
  const fakeUserRepository = {
    async findByEmail() {
      return null;
    },
    async save(userData) {
      return {
        id: "user-1",
        email: userData.email,
        passwordHash: userData.passwordHash,
        fullName: userData.fullName,
        role: userData.role,
        licenseNumber: userData.licenseNumber,
        isActive: true,
        createdAt: new Date().toISOString(),
        toSafeJSON() {
          return {
            id: this.id,
            email: this.email,
            fullName: this.fullName,
            role: this.role,
            licenseNumber: this.licenseNumber,
            isActive: this.isActive,
            createdAt: this.createdAt
          };
        }
      };
    }
  };

  const authService = new AuthService(fakeUserRepository);
  const result = await authService.register({
    email: "customer@example.com",
    password: "strong-pass",
    fullName: "Customer One",
    licenseNumber: "LIC12345"
  });

  assert.equal(result.user.email, "customer@example.com");
  assert.ok(result.token);
});

