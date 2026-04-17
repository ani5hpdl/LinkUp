import type { ApiResponse } from "../../types";
import type { Response, Request } from "express";
import { prisma } from "../../config/db";
import type { AuthRequest } from "../../middleware/authenticate";
import type { CreateComment, PostData, UpdatePostData } from "./postValidator";
import { getPagination } from "../../utils/paginate";
import { success } from "zod";
import { logger } from "../../utils/logger";

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
      error
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
        userId: req.user!.id,
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
        userId: req.user!.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Post Deleted Sucessfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const userSelect = {
  id: true,
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
      where: { id: postId },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,

        user: {
          select: userSelect,
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },

        comments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: userSelect,
            },
          },
        },

        // optional: remove this if not needed
        likes: {
          orderBy: { createdAt: "asc" },
          select: {
            createdAt: true,
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
      error,
    });
  }
};

export const toogleLike = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
  const { postId } = req.params as { postId: string };
  const userId = req.user!.id;

  const fetchPost = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!fetchPost) {
    return res.status(404).json({
      success: false,
      message: "Post Not Found.",
    });
  }

  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existing) {
    const [, updatedLike] = await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: { decrement: 1 },
        },
        select: {
          likeCount: true,
        },
      }),
    ]);

    await prisma.notification.deleteMany({
      where: {
        senderId: userId,
        recipientId: fetchPost.userId,
        type: "like",
        postId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Unliked Post sucessfully.",
      data: updatedLike,
    });
  }

  const [, updatedLike] = await prisma.$transaction([
    prisma.like.create({
      data: {
        userId,
        postId,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: { increment: 1 },
      },
      select: {
        likeCount: true,
      },
    }),
  ]);

  if (fetchPost.userId !== userId) {
    await prisma.notification.create({
      data: {
        recipientId: fetchPost.userId,
        senderId: userId,
        type: "like",
        postId,
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: "Liked a post sucessfully",
    data: updatedLike,
  });
};

export const createComment = async (
  req: AuthRequest & { body: CreateComment },
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { postId } = req.params as { postId: string };
    const userId = req.user!.id;
    const { content } = req.body;

    const fetchPost = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!fetchPost) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found.",
      });
    }

    const [newComment] = await prisma.$transaction([
      prisma.comment.create({ data: { userId, postId, content } }),
      prisma.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);

    if (fetchPost.userId !== userId) {
      await prisma.notification.create({
        data: {
          recipientId: fetchPost.userId,
          senderId: userId,
          type: "comment",
          postId,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "New Comment added sucessfully.",
      data: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const deleteComment = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { postId, commentId } = req.params as {
      postId: string;
      commentId: string;
    };

    const userId = req.user!.id;

    const isCommentExists = await prisma.comment.findUnique({
      where: {
        id: commentId,
        postId,
        userId,
      },
    });

    if (!isCommentExists) {
      return res.status(400).json({
        success: false,
        message: "Comment not found.",
      });
    }

    await prisma.$transaction([
      prisma.comment.delete({ where: { id: commentId } }),
      prisma.post.update({
        where: { id: postId },
        data: { commentCount: { decrement: 1 } },
      }),
      prisma.notification.deleteMany({
        where: { senderId: userId, type: "comment", postId },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Comment deleted Sucessfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const postSelect = {
  id: true,
  content: true,
  imageUrl: true,
  likeCount: true,
  commentCount: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
};

export const getFeed = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { page, limit, skip } = getPagination(req);

    const userId = req.user!.id;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Post Found for now.",
        data: {
          posts: [],
          count: 0,
        },
      });
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { userId: { in: followingIds } },
        select: postSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          userId: {
            in: followingIds,
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Post Fetched Sucessfully.",
      data: {
        posts,
        count: total,
        page,
        limit,
        hasNext: skip + posts.length < total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error at getFeed.",
      error: error,
    });
  }
};

export const getExplore = async (
  req: Request,
  res: Response,
): Promise<Response<ApiResponse>> => {
  const { page, limit, skip } = getPagination(req);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      select: postSelect,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.post.count(),
  ]);

  return res.status(200).json({
    success: true,
    message: "Posts Explored.",
    data: {
      posts,
      count: total,
      page,
      limit,
      hasNext: skip + posts.length < total,
    },
  });
};
