import express from "express";
import cors from "cors";
import conversationsRoutes from "./routes/conversations";

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  app.use(conversationsRoutes);

  return app;
}
