import { NextFunction, Response, Request } from "express";
import { TokenService } from "../services";
import { AppDataSource } from "../config";
import createHttpError from "http-errors";
import { Token } from "../entity";
import { CookieData } from "../types/type";

const tokenRepositoty = AppDataSource.getRepository(Token);
const tokenService = new TokenService(tokenRepositoty);

export default function (req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies as CookieData;
    if (!refreshToken) return next();

    try {
        const token = tokenService.verifyRefreshToken(refreshToken);
        if (token) return next(createHttpError(400, "User already login!"));
        return next();
    } catch (error) {
        return next(createHttpError(500, "Internal Server Error!"));
    }
}
