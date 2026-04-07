import Api from "../lib/axios";
import type { User } from "./auth"

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