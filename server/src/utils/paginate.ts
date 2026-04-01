import type { Request } from "express";
import type { PaginationOptions } from "../types";

export const getPagination = (req: Request): PaginationOptions => {
  const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};
