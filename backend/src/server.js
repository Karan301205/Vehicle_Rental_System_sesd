import { createApp } from "./app.js";
import { checkDatabaseConnection, initializeDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function bootstrap() {
  try {
    await initializeDatabase();
    await checkDatabaseConnection();
    const app = await createApp();

    app.listen(env.PORT, () => {
      console.log(`WheelCheck API listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start WheelCheck API", error);
    process.exit(1);
  }
}

bootstrap();
