import { Router } from "express";
import { createPost, deletePost, getPostById, toogleLike, updatePost } from "./postController";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/",authenticate,createPost);
router.put("/:id",authenticate,updatePost);
router.delete("/:id",authenticate,deletePost);
router.get("/:id",authenticate,getPostById);
router.post("/:id/react",authenticate,toogleLike);

module.exports = router;