import { Router } from "express";
import authRoutes from "../modules/auth/authRoutes.js";
import postRoutes from "../modules/post/postRoutes.js";
import notificationRoute from "../modules/notifications/notificationRoute.js";

const router = Router();

router.use("/auth",authRoutes);
router.use("/post",postRoutes);
router.use("/notification",notificationRoute)

export default router;