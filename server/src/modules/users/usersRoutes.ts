import { Router } from "express";
import { getFollowers, getFollowings, getProfile, searchUser, toogleFollow } from "./usersController";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

//----------Public Routes
router.get("/:username",getProfile);
router.get("/:username/followers",getFollowers);
router.get("/:username/following",getFollowings);
router.get("/searchUser",searchUser);

//---------Protected Routes
router.post("/:username/follow",authenticate,toogleFollow);

export default router;