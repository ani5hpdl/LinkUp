import {
  getLocalPostSearch,
  getLocalUsers,
} from "./discovery.api";

export const searchAll = async (query, page = 1) => {
  const [users, posts] = await Promise.all([
    searchUsers(query, page),
    searchPosts(query, page),
  ]);

  return {
    success: true,
    data: {
      users: users.data ?? users,
      posts: posts.data?.posts ?? posts.data ?? posts,
    },
  };
};

export const searchPosts = async (query) => {
  return getLocalPostSearch(query);
};

export const searchUsers = async (query, page = 1) => {
  const response = await getLocalUsers(query);
  const pageSize = 20;
  const start = Math.max(0, (page - 1) * pageSize);

  return {
    ...response,
    data: response.data.slice(start, start + pageSize),
    page,
    hasNext: start + pageSize < response.data.length,
  };
};
