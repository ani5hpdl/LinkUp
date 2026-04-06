import Api from "../lib/axios";

export interface RegisterData {
    username: string
    displayName: string
    email: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export interface User {
    id : string
    username : string
    email : string
    displayName : string | null
    bio : string | null
    avatarUrl : string | null
    createdAt : Date
    updatedAt : Date
}

export interface AuthResponse {
    success: boolean
    message: string
    data: User
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await Api.post("/api/v1/auth/register",data)
    return response.data;
}

export const loginUser = async (data: LoginData) : Promise<AuthResponse> => {
    const response = await Api.post("/api/v1/auth/login",data)
    return response.data;
}