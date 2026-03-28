import "dotenv/config";
import app from "./src/app.js";
import type { Server } from "http";
import { connectDB, disconnectDB } from "./src/config/db.js";
import { logger } from "./src/utils/logger.js";

let server: Server | undefined;

const start = async (): Promise<void> => {
  try {
    await connectDB();
    console.log("Database connected");

    const PORT = Number(process.env.PORT) || 3000;
    server = app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
      logger.info(
        `🚀 Linkup server running on port ${process.env.PORT} [${process.env.NODE_ENV}]`,
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

const shutdown = async () => {
  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()));
  }
  await disconnectDB();
  logger.info("HTTP server closed.");
  process.exit(0);
};

process.on("SIGINT", shutdown);

process.on("SIGTERM", shutdown);

start();
