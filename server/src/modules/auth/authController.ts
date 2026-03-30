import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { logger } from "../../utils/logger";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { setCookie } from "../../middleware/setCookie";
import type { ApiResponse, IUser } from "../../types";
import type { AuthRequest } from "../../middleware/authenticate";
import type { LoginData, RegisterData, UpdateMeData } from "./authValidator";

export const register = async (
  req: Request<{}, {}, RegisterData>,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { username, email, password, displayName } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email.",
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          message: "Username already exists.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        displayName,
      },
    });

    const { password: _, ...safeUser } = newUser;

    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    setCookie(res, accessToken, refreshToken);

    logger.info("New User Created Sucessfully.");

    return res.status(201).json({
      success: true,
      message: "New User Created Sucessfully.",
      data: safeUser,
    });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginData>,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password } = req.body;

    const fetchUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!fetchUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    const isValidUser = await bcrypt.compare(password, fetchUser.password);

    if (!isValidUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const { password: _, ...safeUser } = fetchUser;

    const accessToken = generateAccessToken(fetchUser);
    const refreshToken = generateRefreshToken(fetchUser);

    setCookie(res, accessToken, refreshToken);

    logger.info("User Logged In.");

    return res.status(200).json({
      success: true,
      message: "Login Sucessfully",
      data: safeUser,
      cookie: accessToken,
    });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
): Promise<Response<ApiResponse>> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "User Logout Sucessfully",
  });
};

export const refresh = async (
  req: Request,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please try logging in again!!",
      });
    }

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET not set" });
    }

    const decoded = jwt.verify(token, secret) as IUser;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not Found!",
      });
    }

    const newAccessToken = generateAccessToken(user);

    setCookie(res, newAccessToken, token);

    return res.status(200).json({
      success: true,
      message: "Token Refreshed by refresh Token!!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error" + error,
    });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
    return res.status(200).json({
      success: true,
      message: "User Fetched",
      data: req.user,
    });
};

export const updateMe = async (
  req: AuthRequest & { body: UpdateMeData },
  res: Response,
): Promise<Response<ApiResponse>> => {

  const { displayName, bio, avatar_url } = req.body;

  try {
    const dataToUpdate: {
      displayName?: string;
      bio?: string;
      avatar_url?: string;
    } = {};

    if (displayName !== undefined) dataToUpdate.displayName = displayName;
    if (bio !== undefined) dataToUpdate.bio = bio;
    if (avatar_url !== undefined) dataToUpdate.avatar_url = avatar_url;

    const updateUser = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: dataToUpdate,
    });

    return res.status(200).json({
      success: true,
      message: "User Updated Sucessfully.",
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error" + error,
    });
  }
};
