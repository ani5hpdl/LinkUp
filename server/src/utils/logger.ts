import winston from "winston";

const { combine, timestamp, json, colorize, printf } = winston.format;

const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} [${level}]: ${message}${extra}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    new winston.transports.File({ filename: "logs/error.log",    level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "HH:mm:ss" }),
        devFormat
      ),
    })
  );
}
