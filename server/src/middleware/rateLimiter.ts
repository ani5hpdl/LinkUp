import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator:(req) => {
        const ip = req.ip;
        return `${ip}`;
    },
    message: {
        status: "fail",
        code: "REGISTER_LIMITED",
        message: "Too many requests",
    },
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        const ip = req.ip;
        return `${ip}`;
    },
    message: {
        status: "fail",
        code: "LOGIN_LIMITED",
        message: "Too many requests",
    },
})