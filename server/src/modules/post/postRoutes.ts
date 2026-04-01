import { Router } from "express";
import { createComment, createPost, deleteComment, deletePost, getExplore, getFeed, getPostById, toogleLike, updatePost } from "./postController";
import { authenticate } from "../../middleware/authenticate";
import validator from "../../middleware/validator";
import { createCommentSchema, createPostSchema, updatePostSchema } from "./postValidator";

const router = Router();

router.post("/",authenticate,validator(createPostSchema),createPost);
router.put("/:id",authenticate,validator(updatePostSchema),updatePost);
router.delete("/:id",authenticate,deletePost);
router.get("/:id",authenticate,getPostById);
router.post("/:id/react",authenticate,toogleLike);
router.post("/:id/comments",authenticate,validator(createCommentSchema),createComment);
router.delete("/:id/comments/:cid",authenticate,deleteComment);
router.get("/feed",authenticate,getFeed);
router.get("/explore",getExplore);

export default router;