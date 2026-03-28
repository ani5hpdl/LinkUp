import { Router } from "express";
import { register } from "./authController";
import validator from "../../middleware/validator";
import { registerSchema } from "./authValidator";

const router = Router();

router.post("/register",validator(registerSchema),register);

export default router;