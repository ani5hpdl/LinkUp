import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../types";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login First!",
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET not set" });
    }
    const decoded = jwt.verify(token, secret) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session Expired!",
    });
  }
};
