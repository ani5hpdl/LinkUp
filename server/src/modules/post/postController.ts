import type { ApiResponse } from "../../types";
import type { Response, Request } from "express";
import { prisma } from "../../config/db";
import type { AuthRequest } from "../../middleware/authenticate";
import type { PostData, UpdatePostData } from "./postValidator";

const createPost = async (
  req: AuthRequest & { body: PostData },
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { content, imageUrl } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const newPost = await prisma.post.create({
      data: {
        userId: req.user.id,
        content,
        imageUrl,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Post Created Succesfully.",
      data: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const updatePost = async (
  req: AuthRequest & { body: UpdatePostData },
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { content, imageUrl } = req.body;
    const { postId } = req.params as { postId: string | undefined };

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Try.",
      });
    }

    const fetchPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!fetchPost || fetchPost?.userId !== postId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Try.",
      });
    }

    const dataToUpdate: {
      content?: string;
      imageUrl?: string;
    } = {};

    if (content !== undefined) dataToUpdate.content = content;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatePost = await prisma.post.update({
      where: { id: postId },
      data: dataToUpdate,
    });

    return res.status(200).json({
      success: true,
      message: "Post Updated",
      data: updatePost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
