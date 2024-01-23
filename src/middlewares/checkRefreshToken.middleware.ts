import { Request } from "express";
import { expressjwt } from "express-jwt";
import createHttpError from "http-errors";
import { CookieType, JWTPayload } from "../types";
import { AppDataSource, logger, REFRESH_TOKEN_SECRET } from "../config";
import { Token } from "../entity";
import { CookieData, TJwtPayload } from "../types/type";

export default expressjwt({
    secret: REFRESH_TOKEN_SECRET ?? "",
    algorithms: ["HS256"],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as CookieData;
        return refreshToken;
    },
    async isRevoked(req: Request, token) {
        if (!token) return true;
        const payload = token.payload as TJwtPayload;
        try {
            const tokenRepository = AppDataSource.getRepository(Token);
            const tokenRef = await tokenRepository.findOne({
                where: {
                    id: Number(payload.tokenId),
                    user: { id: Number(payload.userId) },
                },
            });
            return tokenRef === null;
        } catch (error) {
            logger.error("Error while getting the refresh token", {
                userId: payload.userId,
            });
            return true;
        }
    },
});
