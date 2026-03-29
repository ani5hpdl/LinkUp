export interface IUser{
    id : string,
    username : string,
    email : string,
    password : string,
    display_name : string,
    bio : string | null,
    avatar_url : string | null,
    created_at : Date,
    updated_at : Date
}

export interface ApiResponse{
    success : boolean;
    message: string,
    data?: IUser
}