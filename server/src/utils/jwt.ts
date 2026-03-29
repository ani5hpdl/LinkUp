import type { IUser } from "../types";
import jwt from "jsonwebtoken";

interface AccessTokenPayload {
    id: string;
    email: string;
}

interface RefeshTokenPayload{
    id: string;
}

export const generateAccessToken = (user: IUser): string => {
    const payload: AccessTokenPayload = {
        id: user.id,
        email: user.email,
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {
            expiresIn: "7d",
        },
    );
    
};

export const generateRefreshToken = (user: IUser): string => {
    const payload: RefeshTokenPayload = {
        id: user.id
    }

    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: "30d",
        },
    );
};