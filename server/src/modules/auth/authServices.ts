import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import bcrypt from "bcrypt";
import type { LoginData, RegisterData } from "./authValidator.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { StatusCodes } from "http-status-codes";

export const register = async (data: RegisterData) => {
  const { username, email, password, displayName } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "User already exists with this email.",
      );
    }
    if (existingUser.username === username) {
      throw new ApiError(StatusCodes.CONFLICT, "Username already exists.");
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

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const login = async (data: LoginData) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Invalid Credentials.");
  }

  const isValidUser = await bcrypt.compare(password, user.password);
  if (!isValidUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Invalid Credentials.");
  }

  const { password: _, ...safeUser } = user;

  const accessToken = generateAccessToken(safeUser);
  const refreshToken = generateRefreshToken(safeUser);

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};
