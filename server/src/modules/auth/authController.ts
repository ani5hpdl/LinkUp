import type { Request, Response } from "express";
import { logger } from "../../utils/logger.js";
import { setCookie } from "../../middleware/setCookie.js";
import type { AuthRequest } from "../../middleware/authenticate.js";
import type { LoginData, RegisterData, UpdateMeData } from "./authValidator.js";
import * as authService from "./authServices.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";

export const register = asyncHandler(
  async (req: Request<{}, {}, RegisterData>, res: Response) => {
    const response = await authService.register(req.body);
    setCookie(res, response.accessToken, response.refreshToken);

    logger.info("New User Created.");
    logger.info(response.user);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "New User Created Sucessfully.",
      data: response.user,
    });
  },
);

export const login = asyncHandler(
  async (req: Request<{}, {}, LoginData>, res: Response) => {
    const response = await authService.login(req.body);

    setCookie(res, response.accessToken, response.refreshToken);

    logger.info("User Logged In.");
    logger.info(response.user);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login Sucessfully",
      data: response.user,
    });
  },
);

export const logout = async (
  req: Request,
  res: Response,
) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
  });

  return res.status(200).json({
    success: true,
    message: "User Logout Sucessfully",
  });
};

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const response = await authService.refresh(req.cookies.refreshToken);
  setCookie(res, response, req.cookies.refreshToken);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Token Refreshed by refresh Token!!",
  });
});

export const getMe = async (
  req: AuthRequest,
  res: Response,
) => {
  return res.status(200).json({
    success: true,
    message: "User Fetched",
    data: req.user,
  });
};

export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const response = await authService.updateMe(req.user.id, req.body);
  return res.status(200).json({
    success: true,
    message: "User Updated",
    data: response,
  });
});
