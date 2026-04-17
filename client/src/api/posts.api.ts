import Api from "./axios";

interface UserFetched {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
}

interface PostPage {
    posts : {
        id: string;
        content: string;
        imageUrl: string | null;
        likeCount: number;
        commentCount: number;
        createdAt: Date;
        user: UserFetched;
    }[];
    count: number;
    page: number;
    limit: number;
    hasNext: boolean;
}

interface Post {
    id: string;
    userId: string;
    content: string;
    imageUrl: string | null;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}

interface LikeUpdate {
    updatedLike : number
}

interface DetailedPost extends Post {
    comments : {
        id: string;
        content: string;
        createdAt: Date;
        user: UserFetched
    }[];
    likes : {
        createdAt : string;
        user : UserFetched
    }[];
    _count : {
        likes : number;
        comments : number
    };
}

interface CommentData {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
    postId: string;
}

interface CreatePostData {
    content : string,
    imageUrl? : string
}

interface CreateCommentData {
    content : string
}

type ApiResponse<T = unknown, E = unknown> =
  | {
      success: true;
      message?: string;
      data?: T;
      error?: never;
    }
  | {
      success: false;
      message?: string;
      error?: E;
      data?: never;
    };

export const getFeed = async (): Promise<ApiResponse<PostPage>> => {
    const response = await Api.get("/api/v1/post/feed");
    return response.data;
}

export const getExplore = async() : Promise<ApiResponse<PostPage>> => {
    const response = await Api.get("/api/v1/post/explore");
    return response.data;
}


export const createPost = async(data: CreatePostData) : Promise<ApiResponse<Post>> => {
    const response = await Api.post("/api/v1/post",data);
    return response.data;
}

export const updatePost = async(id : string, data : CreatePostData) : Promise<ApiResponse<Post>> => {
    const response = await Api.put(`/api/v1/post/${id}`,data);
    return response.data;
}

export const deletePost = async(id: string) : Promise<ApiResponse> => {
    const response = await Api.delete(`/api/v1/post/${id}`);
    return response.data;
}

export const updateLike = async(id: string) : Promise<ApiResponse<LikeUpdate>> => {
    const response = await Api.post(`/api/v1/post/${id}/react`);
    return response.data;
}

export const getPostById = async(postId: string) : Promise<DetailedPost>  => {
    const response = await Api.get(`/api/v1/post/${postId}`);
    return response.data;
}

export const createComment = async(id: string, data: CreateCommentData) : Promise<CommentData> => {
    const response = await Api.post(`/api/v1/post/${id}/comments`,data);
    return response.data;
}

/**
 * POSTS API SERVICES
 * Handles all asynchronous network requests related to the Post entity.
 * Supports pagination (feed/explore) and multipart/form-data for image uploads.
 */