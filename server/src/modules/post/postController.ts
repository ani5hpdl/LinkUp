import type { ApiResponse } from "../../types";
import type { Response, Request } from "express";
import { prisma } from "../../config/db";
import type { AuthRequest } from "../../middleware/authenticate";
import type { PostData, UpdatePostData } from "./postValidator";

export const createPost = async (
  req: AuthRequest & { body: PostData },
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { content, imageUrl } = req.body;

    const newPost = await prisma.post.create({
      data: {
        userId: req.user!.id,
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
        message: "Post Not Found.",
      });
    }

    const fetchPost = await prisma.post.findUnique({
      where: {
        id: postId,
        userId: req.user!.id,
      },
    });

    if (!fetchPost) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found.",
      });
    }

    const dataToUpdate: {
      content?: string;
      imageUrl?: string;
    } = {};

    if (content !== undefined) dataToUpdate.content = content;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;

    const updatePost = await prisma.post.update({
      where: { id: postId, userId: req.user!.id },
      data: dataToUpdate,
    });

    return res.status(200).json({
      success: true,
      message: "Post Updated",
      data: updatePost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const deletePost = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { postId } = req.params as { postId: string | undefined };

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found .",
      });
    }

    const fetchPost = await prisma.post.findUnique({
      where: {
        id: postId,
        userId: req.user!.id
      },
    });

    if (!fetchPost) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found.",
      });
    }

    await prisma.post.delete({
      where: {
        id: postId,
        userId: req.user!.id
      }
    })

    return res.status(200).json({
      success: true,
      message: "Post Updated",
      data: updatePost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const userSelect = {
  username: true,
  displayName: true,
  avatarUrl: true,
};

export const getPostById = async (
  req: Request,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { postId } = req.params as { postId: string };

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
      include: {
        //user who created the post
        user: {
          select: userSelect,
        },

        //all comments + who wrote comments
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: userSelect,
            },
          },
        },

        //all likes + who like it
        likes: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: userSelect,
            },
          },
        },
      },
    });

    if (!fetchPost) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post Fetched Sucessfully.",
      data: fetchPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};