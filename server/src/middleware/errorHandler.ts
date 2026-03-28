import type { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

type AnyError = AppError | Prisma.PrismaClientKnownRequestError | Error;

const handlePrismaKnownError = (err: Prisma.PrismaClientKnownRequestError) => {
  switch (err.code) {
    case "P2002": {
      const fields = (err.meta?.target as string[]) ?? [];
      return new AppError(
        `Duplicate value: ${fields.join(", ")} already in use.`,
        409,
        "DUPLICATE_KEY"
      );
    }
    case "P2025":
      return new AppError("Resource not found.", 404, "NOT_FOUND");
    case "P2003":
      return new AppError("Invalid reference. Check related data.", 400, "FOREIGN_KEY_CONSTRAINT");
    default:
      return new AppError("Database request failed.", 400, err.code);
  }
};

export const errorHandler = (
  err: AnyError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError;

  // Normalise known error types
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaKnownError(err);
  } else if (err instanceof TokenExpiredError) {
    error = new AppError("Token expired. Please log in again.", 401, "TOKEN_EXPIRED");
  } else if (err instanceof JsonWebTokenError) {
    error = new AppError("Invalid token. Please log in again.", 401, "INVALID_TOKEN");
  } else {
    error = new AppError("Something went wrong.", 500);
  }

  // Log unexpected errors
  if (!error.isOperational) {
    logger.error({ requestId: (req as Request & { id?: string }).id, err });
  }

  res.status(error.statusCode).json({
    status:  error.statusCode >= 500 ? "error" : "fail",
    code:    error.code,
    message: error.isOperational ? error.message : "Something went wrong.",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
