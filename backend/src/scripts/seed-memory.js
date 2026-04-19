import { initializeDatabase } from "../config/database.js";

async function main() {
  await initializeDatabase();
  console.log("In-memory WheelCheck database is seeded and ready.");
  console.log("Admin login: admin@wheelcheck.dev / secret123");
  console.log("Customer login: customer@wheelcheck.dev / secret123");
}

main().catch((error) => {
  console.error("Failed to seed in-memory database", error);
  process.exit(1);
});
