import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { getNotification, readNotification } from "./notificationController";

const router = Router();

router.get("/",authenticate,getNotification);
router.patch("/:notificationId/read",authenticate,readNotification);

export default router;