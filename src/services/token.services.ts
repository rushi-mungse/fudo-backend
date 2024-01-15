import { Repository } from "typeorm";
import { sign, verify } from "jsonwebtoken";
import createHttpError from "http-errors";
import { JWTPayload } from "../types";
import { Token, User } from "../entity";
import { PRIVATE_KEY, REFRESH_TOKEN_SECRET } from "../config";

class TokenService {
    constructor(private tokenRepository: Repository<Token>) {}

    signAccessToken(payload: JWTPayload) {
        if (!PRIVATE_KEY)
            throw createHttpError(500, "PRIVATE_KEY is not found!");

        const accessToken = sign(payload, PRIVATE_KEY, {
            algorithm: "RS256",
            expiresIn: "24h",
            issuer: "fudo-service",
        });

        return accessToken;
    }

    signRefreshToken(payload: JWTPayload) {
        if (!REFRESH_TOKEN_SECRET)
            throw createHttpError(500, "TOKEN_SECRET is not found!");

        const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "fudo-service",
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async saveRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
        const expiresAt = new Date(Date.now() + MS_IN_YEAR);
        return await this.tokenRepository.save({ user, expiresAt });
    }

    async deleteToken(tokenId: number) {
        await this.tokenRepository.delete(tokenId);
    }

    verifyRefreshToken(refreshToken: string) {
        if (!REFRESH_TOKEN_SECRET)
            throw createHttpError(500, "SECRET_HASH is not found!");
        return verify(refreshToken, REFRESH_TOKEN_SECRET);
    }
}

export default TokenService;
