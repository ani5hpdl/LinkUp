import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding started...");

  // ─────────────────────────────────────────
  // USERS (10)
  // ─────────────────────────────────────────
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: "hashedpassword",
          displayName: `User ${i + 1}`,
        },
      })
    )
  );

  // ─────────────────────────────────────────
  // POSTS (10)
  // ─────────────────────────────────────────
  const posts = await Promise.all(
    users.map((user, i) =>
      prisma.post.create({
        data: {
          userId: user.id,
          content: `This is post ${i + 1} 🚀`,
        },
      })
    )
  );

  // ─────────────────────────────────────────
  // LIKES (randomized)
  // ─────────────────────────────────────────
  const likesData: { userId: string; postId: string }[] = [];

  posts.forEach((post) => {
    users.forEach((user) => {
      // random like chance
      if (Math.random() > 0.5) {
        likesData.push({
          userId: user.id,
          postId: post.id,
        });
      }
    });
  });

  await prisma.like.createMany({
    data: likesData,
    skipDuplicates: true,
  });

  // ─────────────────────────────────────────
  // COMMENTS (randomized)
  // ─────────────────────────────────────────
  const commentsData: any[] = [];

  posts.forEach((post) => {
    users.forEach((user) => {
      if (Math.random() > 0.7) {
        commentsData.push({
          userId: user.id,
          postId: post.id,
          content: `Comment from ${user.username} 💬`,
        });
      }
    });
  });

  await prisma.comment.createMany({
    data: commentsData,
  });

  // ─────────────────────────────────────────
  // UPDATE COUNTS (IMPORTANT)
  // ─────────────────────────────────────────
  for (const post of posts) {
    const likeCount = await prisma.like.count({
      where: { postId: post.id },
    });

    const commentCount = await prisma.comment.count({
      where: { postId: post.id },
    });

    await prisma.post.update({
      where: { id: post.id },
      data: {
        likeCount,
        commentCount,
      },
    });
  }

  // ─────────────────────────────────────────
  // FOLLOWS (network graph)
  // ─────────────────────────────────────────
  const followsData: any[] = [];

  users.forEach((user) => {
    users.forEach((target) => {
      if (user.id !== target.id && Math.random() > 0.6) {
        followsData.push({
          followerId: user.id,
          followingId: target.id,
        });
      }
    });
  });

  await prisma.follow.createMany({
    data: followsData,
    skipDuplicates: true,
  });

  console.log("✅ Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });