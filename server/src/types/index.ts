export interface IUser{
    id : string,
    username : string,
    email : string,
    displayName : string | null,
    bio : string | null,
    avatarUrl : string | null,
    createdAt : Date,
    updatedAt : Date
}

export interface ApiResponse{
    success : boolean;
    message: string,
    data?: IUser
}

export interface PaginationOptions {
  page:  number;
  limit: number;
  skip:  number;
}