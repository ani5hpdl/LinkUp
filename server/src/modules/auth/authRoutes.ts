import { Router } from "express";
import { getMe, login, logout, refresh, register, updateMe } from "./authController";
import validator from "../../middleware/validator";
import { loginSchema, registerSchema, updateMeSchema } from "./authValidator";
import { loginLimiter, registerLimiter } from "../../middleware/rateLimiter";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

//----------Public Routes
router.post("/register",validator(registerSchema),registerLimiter,register);
router.post("/login",validator(loginSchema),loginLimiter,login);

//---------Protected Routes
router.post("/refresh",authenticate,refresh);
router.post("/logout",authenticate,logout);
router.post("/me",authenticate,getMe);
router.put("/me",authenticate,validator(updateMeSchema),updateMe);

export default router;