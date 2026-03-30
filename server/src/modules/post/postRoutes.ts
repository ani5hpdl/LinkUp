import { Router } from "express";
import { createPost, deletePost, getPostById, updatePost } from "./postController";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/",authenticate,createPost);
router.put("/:id",authenticate,updatePost);
router.delete("/:id",authenticate,deletePost);
router.get("/:id",authenticate,getPostById);

module.exports = router;