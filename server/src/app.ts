import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";

import { logger } from "./utils/logger.js";
import { requestId } from "./middleware/requestId.js";
import { notFound } from "./middleware/notFound.js";
// import { errorHandler } from "./middleware/errorHandler.js";
// import routes from "./routes/index.js";

const app = express();

//-----Security------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow cookies for refresh token
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

//-----Performance--------------------------
app.use(compression());

//-----Request Tracking---------------------
app.use(requestId);

//-----Logging------------------------------
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: (req) => req.url === "/health", // don't log health checks
  }),
);

//-----Body Prasing-------------------------
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//-----Global rate Limiter------------------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    code: "RATE_LIMITED",
    message: "Too many requests.",
  },
});
app.use("/api", globalLimiter);

//-----Health Check--------------------------
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "linkup-server",
    env: process.env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
  });
});

//-----Api Routes--------------------------
// app.use("/api/v1", routes);

//-----404 + error handling----------------
app.use(notFound);
// app.use(errorHandler);

export default app;
