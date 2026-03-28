import { Router } from "express";
import { login, register } from "./authController";
import validator from "../../middleware/validator";
import { loginSchema, registerSchema } from "./authValidator";
import { loginLimiter, registerLimiter } from "../../middleware/rateLimiter";

const router = Router();

//----------Public Routes
router.post("/register",validator(registerSchema),registerLimiter,register);
router.post("/login",validator(loginSchema),loginLimiter,login);

export default router;