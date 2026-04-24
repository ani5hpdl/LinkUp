import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import bcrypt from "bcrypt";
import type { LoginData, RegisterData, UpdateMeData } from "./authValidator.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { StatusCodes } from "http-status-codes";
import type { IUser } from "../../types/index.js";
import jwt from "jsonwebtoken";

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

export const refresh = async (token: string) => {
  if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, "No Token");
  let decoded: IUser;

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as IUser;
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
  }
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User Not Found");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

export const updateMe = async (userId: string, data: UpdateMeData) => {
  const dataToUpdate: {
    displayName?: string;
    bio?: string;
    avatar_url?: string;
  } = {};

  if (data.displayName !== undefined) {
    dataToUpdate.displayName = data.displayName;
  }

  if (data.bio !== undefined) {
    dataToUpdate.bio = data.bio;
  }

  if (data.avatar_url !== undefined) {
    dataToUpdate.avatar_url = data.avatar_url;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No fields to update");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
    }
  });

  return updatedUser;
};
