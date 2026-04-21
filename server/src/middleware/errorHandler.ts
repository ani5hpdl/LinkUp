import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils//apiError";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let { statusCode, message , errors} = err;

    if(!(err instanceof ApiError)){
        statusCode = 500;
        message = "Internal Server Error";
        errors = [];
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack : err.stack
    });

}