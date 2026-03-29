import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import { logger } from "../../utils/logger";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { setCookie } from "../../middleware/setCookie";
import type { ApiResponse, LoginBody, RegisterBody } from "../../types";

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { username, email, password, display_name } = req.body;

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
        display_name,
      },
    });

    const { password: _, ...safeUser } = newUser;

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

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
  req: Request<{}, {}, LoginBody>,
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
      cookie: accessToken
    });

  } catch (error: unknown) {

    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
