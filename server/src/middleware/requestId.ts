import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const requestId = (req: Request & { id?: string }, res: Response, next: NextFunction): void => {
  const id = (req.headers["x-request-id"] as string) ?? randomUUID();
  req.id   = id;
  res.setHeader("x-request-id", id);
  next();
};
