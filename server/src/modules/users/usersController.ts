import { success } from "zod";
import { prisma } from "../../config/db";
import type { ApiResponse } from "../../types";
import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate";
import { getPagination } from "../../utils/paginate";

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { username } = req.params as { username: string };

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { followers: true, following: true },
        },
        posts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            imageUrl: true,
            likeCount: true,
            commentCount: true,
            createdAt: true,
            likes: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            comments: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "User Fetched Sucessfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error,
    });
  }
};

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
};

export const getFollowers = async (
  req: Request,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { username } = req.params as { username: string };

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with certain username.",
      });
    }

    const { page, limit, skip } = getPagination(req);

    const [followers, total] = await prisma.$transaction([
      prisma.follow.findMany({
        where: {
          followingId: user.id,
        },
        select: {
          follower: {
            select: userSelect,
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.follow.count({
        where: {
          followingId: user.id,
        },
      }),
    ]);

    const data = followers.map((f) => ({
      ...f.follower,
      followedAt: f.createdAt,
    }));

    if (data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Data Found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data Fetched Sucessfully",
      data,
      count: total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error,
    });
  }
};

export const getFollowings = async (
  req: Request,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { username } = req.params as { username: string };

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with certain username.",
      });
    }

    const { page, limit, skip } = getPagination(req);

    const [followings, total] = await prisma.$transaction([
      prisma.follow.findMany({
        where: {
          followerId: user.id,
        },
        select: {
          following: {
            select: userSelect,
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.follow.count({
        where: {
          followerId: user.id,
        },
      }),
    ]);

    const data = followings.map((f) => ({
      ...f.following,
      followingAt: f.createdAt,
    }));

    if (data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Data Found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data Fetched Sucessfully",
      data,
      count: total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error,
    });
  }
};

export const toogleFollow = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
  const followerId = req.user!.id;

  const { username } = req.params as { username: string };

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with certain username.",
    });
  }

  const followingId = user.id;

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (existing) {
    const [, count] = await prisma.$transaction([
      prisma.follow.delete({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      }),
      prisma.follow.count({
        where: {
          followingId,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Unfollow this User.",
      count,
    });
  }

  const [, count] = await prisma.$transaction([
    prisma.follow.create({
      data: {
        followerId,
        followingId
      },
    }),
    prisma.follow.count({
      where: {
        followingId,
      },
    }),
  ]);

  return res.status(200).json({
    success: true,
    message: "Unfollow this User.",
    count,
  });
};