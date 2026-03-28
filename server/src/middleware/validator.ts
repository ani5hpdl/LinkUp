import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { logger } from "../utils/logger";

/**
 * Wraps a Zod schema into an Express validator middleware.
 * - Runs `safeParse` on `req.body`
 * - Returns 400 with flattened messages when validation fails
 * - Replaces `req.body` with the parsed (coerced/stripped) data
 */
const validator =
  (schema: ZodTypeAny): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body ?? {};

    logger.info(payload);

    const result = schema.safeParse(payload);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    req.body = result.data;
    next();
  };

export default validator;
