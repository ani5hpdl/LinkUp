import { Router } from "express";
import authRoutes from "../modules/auth/authRoutes.js";
import postRoutes from "../modules/post/postRoutes.js";

const router = Router();

router.use("/auth",authRoutes);
router.use("/post",postRoutes);

export default router;