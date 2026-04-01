import { Router } from "express";
import { createComment, createPost, deleteComment, deletePost, getExplore, getFeed, getPostById, toogleLike, updatePost } from "./postController";
import { authenticate } from "../../middleware/authenticate";
import validator from "../../middleware/validator";
import { createCommentSchema, createPostSchema, updatePostSchema } from "./postValidator";

const router = Router();

router.post("/",authenticate,validator(createPostSchema),createPost);
router.get("/feed",authenticate,getFeed);
router.get("/explore",getExplore);
router.put("/:postId",authenticate,validator(updatePostSchema),updatePost);
router.delete("/:postId",authenticate,deletePost);
router.get("/:postId",authenticate,getPostById);
router.post("/:postId/react",authenticate,toogleLike);
router.post("/:postId/comments",authenticate,validator(createCommentSchema),createComment);
router.delete("/:postId/comments/:commentId",authenticate,deleteComment);

export default router;