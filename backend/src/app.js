import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { createApiRouter } from "./routes/index.js";

export async function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "wheelcheck-api"
    });
  });

  app.use("/api", await createApiRouter());

  app.use((error, _request, response, _next) => {
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? "Internal server error";

    response.status(statusCode).json({
      message
    });
  });

  return app;
}
