import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { eventsRouter } from "./routes/events.routes.js";
import { reportsRouter } from "./routes/reports.routes.js";
import { venuesRouter } from "./routes/venues.routes.js";
import { usersRouter } from "./routes/users.routes.js";

export const app = express();
const configuredOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    const isLocalDevelopment = env.NODE_ENV === "development"
      && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin ?? "");
    if (!origin || configuredOrigins.includes(origin) || isLocalDevelopment) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok", service: "eventflow-api" }));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/events", eventsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/reports", reportsRouter);

if (env.NODE_ENV === "production") {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const frontendDirectory = path.resolve(currentDirectory, "../frontend/dist");

  app.use(express.static(frontendDirectory));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDirectory, "index.html"));
  });
}

app.use(errorHandler);
