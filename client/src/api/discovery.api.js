import { getExplore } from "./posts.api";
import { getMe } from "./auth.api";

const exploreCache = new Map();

export const loadExplorePosts = async ({ limit = 50, maxPages = 5 } = {}) => {
  const cacheKey = `${limit}:${maxPages}`;

  if (exploreCache.has(cacheKey)) {
    return exploreCache.get(cacheKey);
  }

  const promise = (async () => {
    const posts = [];

    for (let page = 1; page <= maxPages; page += 1) {
      const response = await getExplore(page, limit);
      const batch = response?.data?.posts ?? response?.data ?? [];

      posts.push(...batch);

      if (batch.length < limit) break;
    }

    return posts;
  })();

  exploreCache.set(cacheKey, promise);

  try {
    return await promise;
  } catch (error) {
    exploreCache.delete(cacheKey);
    throw error;
  }
};

export const uniqueAuthorsFromPosts = (posts, query = "") => {
  const needle = query.trim().toLowerCase();
  const seen = new Set();

  return posts.reduce((authors, post) => {
    const user = post.user ?? post.author;
    const username = user?.username;

    if (!username || seen.has(username)) return authors;

    if (needle) {
      const haystack = [
        username,
        user?.displayName,
        post.content,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(needle)) return authors;
    }

    seen.add(username);
    authors.push({
      id: user?.id ?? username,
      username,
      displayName: user?.displayName ?? username,
      avatarUrl: user?.avatarUrl ?? null,
      bio: user?.bio ?? null,
    });
    return authors;
  }, []);
};

export const buildProfileFromPosts = ({ username, posts, fallbackUser = null }) => {
  const authoredPosts = posts.filter((post) => {
    const author = post.user ?? post.author;
    return author?.username === username;
  });

  const author = fallbackUser ?? authoredPosts[0]?.user ?? authoredPosts[0]?.author ?? null;

  if (!author) return null;

  return {
    id: author.id ?? username,
    username: author.username ?? username,
    displayName: author.displayName ?? username,
    avatarUrl: author.avatarUrl ?? null,
    bio: author.bio ?? null,
    createdAt: author.createdAt ?? null,
    postCount: authoredPosts.length,
    followerCount: 0,
    followingCount: 0,
    isFollowing: false,
    posts: authoredPosts,
    _count: {
      followers: 0,
      following: 0,
    },
  };
};

export const getLocalProfile = async (username) => {
  if (!username) return null;

  const posts = await loadExplorePosts().catch(() => []);
  const profile = buildProfileFromPosts({
    username,
    posts,
  });

  if (profile) return profile;

  const me = await getMe().catch(() => null);
  if (me?.username !== username) return null;

  return buildProfileFromPosts({
    username,
    posts,
    fallbackUser: me,
  });
};

export const getLocalFollowers = async () => ({
  success: true,
  data: [],
  page: 1,
  count: 0,
  hasNext: false,
});

export const getLocalFollowings = async () => ({
  success: true,
  data: [],
  page: 1,
  count: 0,
  hasNext: false,
});

export const getLocalUsers = async (query = "") => {
  const posts = await loadExplorePosts().catch(() => []);
  const users = uniqueAuthorsFromPosts(posts, query);
  const me = await getMe().catch(() => null);
  const needle = query.trim().toLowerCase();

  if (me && (!needle || `${me.username} ${me.displayName ?? ""}`.toLowerCase().includes(needle))) {
    const exists = users.some((user) => user.username === me.username);
    if (!exists) {
      users.unshift({
        id: me.id ?? me.username,
        username: me.username,
        displayName: me.displayName ?? me.username,
        avatarUrl: me.avatarUrl ?? null,
        bio: me.bio ?? null,
      });
    }
  }

  return {
    success: true,
    data: users,
    page: 1,
    count: users.length,
    hasNext: false,
  };
};

export const getLocalPostSearch = async (query = "") => {
  const posts = await loadExplorePosts().catch(() => []);
  const needle = query.trim().toLowerCase();

  const filtered = needle
    ? posts.filter((post) => {
        const content = (post.content ?? "").toLowerCase();
        const username = (post.user?.username ?? post.author?.username ?? "").toLowerCase();
        const displayName = (post.user?.displayName ?? post.author?.displayName ?? "").toLowerCase();

        return (
          content.includes(needle) ||
          username.includes(needle) ||
          displayName.includes(needle)
        );
    })
    : posts;

  return {
    success: true,
    data: {
      posts: filtered,
    },
  };
};
