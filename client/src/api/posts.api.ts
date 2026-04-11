import Api from "./axios";
import type { User } from "./auth.api"
import { boolean, string, success } from "zod";

export interface Post {
    id: string,
    content: string,
    imageUrl: string | null,
    likeCount: number,
    commentCount: number,
    createdAt: string,
    user: User
}

export interface PostResponse {
    success : boolean
    message : string
    data : {
        posts : Post[]
        count : number 
    }
}

export interface UpdatedLike {
    likeCount : number
}

export interface LikeResponse {
    success : boolean
    message : string
    data : UpdatedLike
}

export interface PostDetailResponse { 
    success : boolean
    message : string
    data : DetailedPost
}

export interface DetailedPost {
    id: string
    content : string
    imageUrl : string | null
    createdAt : string
    updatedAt : string
    user : Users
    _count : Count
    comments : Comment[]
    likes : Likes[]
}

export interface Users {
    id : string
    username: string
    displayName : string
    avatarUrl : string | null
}

interface Count {
    likes : number
    comments : number
}

interface Comment {
    id : string
    content : string
    createdAt : string
    user : User
}

interface Likes {
    createdAt : string
    user : Users
}

export interface CommentResponse {
    success: boolean
    message: string
    data : {
        id: string
        userId : string
        postId : string
        content : string
        createdAt : string
    }
}

interface CommentData {
    content : string
}

export const getFeed = async (): Promise<PostResponse> => {
    const response = await Api.get("/api/v1/post/feed");
    return response.data;
}

export const getExplore = async() : Promise<PostResponse> => {
    const response = await Api.get("/api/v1/post/explore");
    return response.data;
}

export const updateLike = async(id: string) : Promise<LikeResponse> => {
    const response = await Api.post(`/api/v1/post/${id}/react`);
    return response.data;
}

export const getPostById = async(id: string) : Promise<PostDetailResponse>  => {
    const response = await Api.get(`/api/v1/post/${id}`);
    return response.data;
}

export const createComment = async(id: string, data: CommentData) : Promise<CommentResponse> => {
    const response = await Api.post(`/api/v1/post/${id}/comments`,data);
    return response.data;
}

/**
 * POSTS API SERVICES
 * Handles all asynchronous network requests related to the Post entity.
 * Supports pagination (feed/explore) and multipart/form-data for image uploads.
 */