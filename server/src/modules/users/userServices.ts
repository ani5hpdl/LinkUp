import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";

export const getUserProfile = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
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
};

export const getFollowers = async ({
  username,
  cursor,
  limit = 10,
}: {
  username: string;
  cursor?: string;
  limit?: number;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found with certain username.");
  }
  const followers = await prisma.user.findUnique({
    where: {
      followingId: user.id,
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    ...(cursor && {
      skip: 1,
      cursor: {
        createdAt: new Date(cursor),
      },
    }),
    select: {
      follower: {
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
      createdAt: true,
    },
  });

  return (followers as any[]).map((f) => ({
    ...f.follower,
    followedAt: f.createdAt,
  }));
};
