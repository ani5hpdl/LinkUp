import Api from "./axios";

export interface UserFetched {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio?: string | null;
}

export type Users = UserFetched;

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  user: UserFetched;
}

export interface PostPage {
  posts: Post[];
  count: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface LikeUpdate {
  likeCount: number;
}

export interface DetailedPost extends Post {
  user: UserFetched;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: UserFetched;
  }[];
  likes: {
    createdAt: string;
    user: UserFetched;
  }[];
  _count: {
    likes: number;
    comments: number;
  };
}

export interface CommentData {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  postId: string;
}

export interface CreatePostData {
  content: string;
  imageUrl?: string;
}

export interface CreateCommentData {
  content: string;
}

export type ApiResponse<T = unknown, E = unknown> =
  | {
      success: true;
      message?: string;
      data: T;
      count?: number;
      error?: never;
    }
  | {
      success: false;
      message?: string;
      error?: E;
      data?: never;
      count?: number;
    };

const withPagination = (path: string, page = 1, limit = 20) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  return `${path}?${params.toString()}`;
};

export const getFeed = async (
  page = 1,
  limit = 20,
): Promise<ApiResponse<PostPage>> => {
  const response = await Api.get(withPagination("/api/v1/post/feed", page, limit));
  return response.data;
};

export const getExplore = async (
  page = 1,
  limit = 20,
): Promise<ApiResponse<PostPage>> => {
  const response = await Api.get(withPagination("/api/v1/post/explore", page, limit));
  return response.data;
};

export const createPost = async (
  data: CreatePostData,
): Promise<ApiResponse<Post>> => {
  const response = await Api.post("/api/v1/post", data);
  return response.data;
};

export const updatePost = async (
  id: string,
  data: CreatePostData,
): Promise<ApiResponse<Post>> => {
  const response = await Api.put(`/api/v1/post/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string): Promise<ApiResponse<void>> => {
  const response = await Api.delete(`/api/v1/post/${id}`);
  return response.data;
};

export const updateLike = async (id: string): Promise<ApiResponse<LikeUpdate>> => {
  const response = await Api.post(`/api/v1/post/${id}/react`);
  return response.data;
};

export const getPostById = async (
  postId: string,
): Promise<ApiResponse<DetailedPost>> => {
  const response = await Api.get(`/api/v1/post/${postId}`);
  return response.data;
};

export const createComment = async (
  id: string,
  data: CreateCommentData,
): Promise<ApiResponse<CommentData>> => {
  const response = await Api.post(`/api/v1/post/${id}/comments`, data);
  return response.data;
};

export const deleteComment = async (
  postId: string,
  commentId: string,
): Promise<ApiResponse<void>> => {
  const response = await Api.delete(`/api/v1/post/${postId}/comments/${commentId}`);
  return response.data;
};

/**
 * POSTS API SERVICES
 * Handles all asynchronous network requests related to the Post entity.
 * Supports pagination (feed/explore) and multipart/form-data for image uploads.
 */
