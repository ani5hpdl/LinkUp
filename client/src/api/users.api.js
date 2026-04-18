import { getMe } from "./auth.api";
import {
  getLocalFollowers,
  getLocalFollowings,
  getLocalProfile,
  getLocalUsers,
} from "./discovery.api";

export const getProfile = async (username) => {
  return getLocalProfile(username);
};

export const getFollowers = async (_username, _page = 1) => {
  return getLocalFollowers();
};

export const getFollowings = async (_username, _page = 1) => {
  return getLocalFollowings();
};

export const toggleFollow = async (_username) => {
  throw new Error("Follow actions are not available until the server exposes the users routes.");
};

export const uploadAvatar = async (_formData) => {
  throw new Error("Avatar upload is not available until the server exposes a matching upload route.");
};

export const searchUsers = async (query, page = 1) => {
  const response = await getLocalUsers(query);
  const pageSize = 20;
  const start = Math.max(0, (page - 1) * pageSize);
  const data = response.data.slice(start, start + pageSize);

  return {
    ...response,
    data,
    page,
    hasNext: start + pageSize < response.data.length,
  };
};

export const getCurrentUser = getMe;
