export class ApiError extends Error {
    public statusCode: number;
    public data : null;
    public success : boolean;
    public errors : unknown;

    constructor(statusCode: number, message: string, errors=[],){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors

        Error.captureStackTrace(this, this.constructor);
    }
}