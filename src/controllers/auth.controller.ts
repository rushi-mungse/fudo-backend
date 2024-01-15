import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { UserService, CredentialService, TokenService } from "../services";
import { JWTPayload, SendOtpRequest, VerifyOtpRequest } from "../types";

class AuthController {
    constructor(
        private logger: Logger,
        private userService: UserService,
        private credentialService: CredentialService,
        private tokenService: TokenService,
    ) {}

    async sendOtp(req: SendOtpRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const { fullName, email, password, confirmPassword } = req.body;
        this.logger.info({ fullName, email });

        if (password !== confirmPassword) {
            const err = createHttpError(
                400,
                "Confirm password does not match to password!",
            );
            return next(err);
        }

        try {
            const user = await this.userService.findUserByEmail(email);
            if (user) {
                return next(
                    createHttpError(400, "This email already registered!"),
                );
            }

            const hashPassword =
                await this.credentialService.hashData(password);

            const ttl = 1000 * 60 * 15;
            const expires = Date.now() + ttl;
            const otp = this.credentialService.generateOtp();
            const dataForHash = `${otp}.${email}.${expires}.${hashPassword}`;
            const hashData =
                this.credentialService.hashDataWithSecret(dataForHash);
            const hashOtp = `${hashData}#${expires}#${hashPassword}`;

            const otpInfo = { fullName, email, hashOtp };
            return res.json({
                otpInfo,
                otp,
                message: `Otp sent successfully by email ${email}`,
            });
        } catch (error) {
            return next(error);
        }
    }

    async verifyOtp(req: VerifyOtpRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const { fullName, email, otp, hashOtp } = req.body;
        this.logger.info({ fullName, email, hashOtp, otp });

        if (hashOtp.split("#").length !== 3) {
            const error = createHttpError(400, "Otp is invalid!");
            return next(error);
        }

        const [prevHashOtp, expires, hashPassword] = hashOtp.split("#");

        try {
            const user = await this.userService.findUserByEmail(email);
            if (user) {
                const error = createHttpError(
                    400,
                    "This email already registered!",
                );
                return next(error);
            }

            if (Date.now() > +expires) {
                const error = createHttpError(408, "Otp is expired!");
                return next(error);
            }

            const dataForHash = `${otp}.${email}.${expires}.${hashPassword}`;
            const curHashOtp =
                this.credentialService.hashDataWithSecret(dataForHash);

            if (curHashOtp !== prevHashOtp) {
                const error = createHttpError(400, "Otp is invalid!");
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        try {
            const user = await this.userService.saveUser({
                fullName,
                email,
                password: hashPassword,
            });

            const payload: JWTPayload = {
                userId: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.signAccessToken(payload);
            const token = await this.tokenService.saveRefreshToken(user);
            const refreshToken = this.tokenService.signRefreshToken({
                ...payload,
                tokenId: String(token.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 365,
            });

            return res.json({
                user: { ...user, password: null },
                message: "User register successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default AuthController;
