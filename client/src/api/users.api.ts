import Api from "./axios";

export interface ApiResponse<T = unknown, E = unknown> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  error?: E;
}

export interface UserSummary {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio?: string | null;
}

export interface ProfilePost {
  id: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  likes: {
    user: UserSummary;
  }[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: UserSummary;
  }[];
}

export interface ProfileUser extends UserSummary {
  bio: string | null;
  createdAt: string;
  _count: {
    followers: number;
    following: number;
  };
  posts: ProfilePost[];
}

export interface FollowerUser extends UserSummary {
  followedAt: string;
}

export interface FollowingUser extends UserSummary {
  followingAt: string;
}

const withPagination = (path: string, page = 1, limit = 20) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  return `${path}?${params.toString()}`;
};

export const getProfile = async (
  username: string,
): Promise<ApiResponse<ProfileUser | null>> => {
  const response = await Api.get(`/api/v1/user/${username}`);
  return response.data;
};

export const getFollowers = async (
  username: string,
  page = 1,
  limit = 20,
): Promise<ApiResponse<FollowerUser[]>> => {
  const response = await Api.get(
    withPagination(`/api/v1/user/${username}/followers`, page, limit),
  );
  return response.data;
};

export const getFollowings = async (
  username: string,
  page = 1,
  limit = 20,
): Promise<ApiResponse<FollowingUser[]>> => {
  const response = await Api.get(
    withPagination(`/api/v1/user/${username}/following`, page, limit),
  );
  return response.data;
};

export const toggleFollow = async (
  username: string,
): Promise<ApiResponse<void>> => {
  const response = await Api.post(`/api/v1/user/${username}/follow`);
  return response.data;
};
