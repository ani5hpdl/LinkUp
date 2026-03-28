import { Router } from "express";
import { login, register } from "./authController";
import validator from "../../middleware/validator";
import { loginSchema, registerSchema } from "./authValidator";

const router = Router();

router.post("/register",validator(registerSchema),register);
router.post("/login",validator(loginSchema),login);

export default router;