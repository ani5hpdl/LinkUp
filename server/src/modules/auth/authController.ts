import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import { logger } from "../../utils/logger";
import { success } from "zod";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, display_name } = req.body;

    const isUserExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const isUserNameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (isUserNameExists) {
      return res.status(400).json({
        success: false,
        message: "Username already exists.",
      });
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

    logger.info("New User Created Sucessfully.");

    return res.status(201).json({
      success: true,
      message: "New User Created Sucessfully.",
      data: newUser,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {email,password} = req.body;

    const fetchUser = await prisma.user.findUnique({
        where: {
            email : email
        }
    });

    if(!fetchUser){
        return res.status(404).json({
            success: false,
            message: "Invalid Credentials."
        });
    }

    const isValidUser = await bcrypt.compare(password,fetchUser.password);

    if(!isValidUser){
        return res.status(404).json({
            success: false,
            message: "Invalid Credentials"
        });
    }

    logger.info("User Logged In.");

    return res.status(200).json({
        success: false,
        message: "Login Sucessfully"
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
