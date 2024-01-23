import { Repository } from "typeorm";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Token } from "../entity";
import { PRIVATE_KEY, REFRESH_TOKEN_SECRET } from "../config";
import { TJwtPayload, TokenData, TokenServiceType } from "../types/type";

class TokenService implements TokenServiceType<Token, TokenData> {
    constructor(private tokenRepository: Repository<Token>) {}

    signAccessToken(payload: TJwtPayload): string {
        if (!PRIVATE_KEY)
            throw createHttpError(500, "PRIVATE_KEY is not found!");

        const accessToken = sign(payload, PRIVATE_KEY, {
            algorithm: "RS256",
            expiresIn: "24h",
            issuer: "fudo-service",
        });

        return accessToken;
    }

    signRefreshToken(payload: TJwtPayload): string {
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

    verifyRefreshToken(refreshToken: string): JwtPayload | string {
        if (!REFRESH_TOKEN_SECRET)
            throw createHttpError(500, "SECRET_HASH is not found!");
        return verify(refreshToken, REFRESH_TOKEN_SECRET);
    }

    async save(tokenData: TokenData): Promise<Token> {
        return await this.tokenRepository.save(tokenData);
    }

    async getById(tokenId: number): Promise<Token | null> {
        return await this.tokenRepository.findOne({
            where: { id: tokenId },
        });
    }

    async gets(): Promise<Token[]> {
        return await this.tokenRepository.find({
            relations: { user: true },
        });
    }

    async delete(tokenId: number): Promise<void> {
        await this.tokenRepository.delete(tokenId);
    }

    // const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
    // const expiresAt = new Date(Date.now() + MS_IN_YEAR);
}

export default TokenService;
