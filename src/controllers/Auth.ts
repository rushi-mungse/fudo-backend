import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { Token, User } from "../entity";
import {
    AuthRequest,
    SendOtpRequestBody,
    UserServiceType,
    UserData,
    CredentialServiceType,
    TokenServiceType,
    TokenData,
    VerifyOtpRequestBody,
    TJwtPayload,
    LoginRequestBody,
    ForgetPasswordRequestBody,
    SetPasswordRequestBody,
} from "../types/type";

class AuthController {
    constructor(
        private logger: Logger,
        private userService: UserServiceType<User, UserData>,
        private credentialService: CredentialServiceType,
        private tokenService: TokenServiceType<Token, TokenData>,
    ) {}

    async sendOtp(
        req: AuthRequest<SendOtpRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
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
            const user = await this.userService.getByEmail(email);
            if (user) {
                return next(
                    createHttpError(400, "This email already registered!"),
                );
            }

            const hashPassword =
                await this.credentialService.hashData(password);

            const ttl = 1000 * 60 * 15;
            const expires = Date.now() + ttl;
            const otp = this.credentialService.getOtp();
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

    async verifyOtp(
        req: AuthRequest<VerifyOtpRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
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
            const user = await this.userService.getByEmail(email);
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
            const user = await this.userService.save({
                fullName,
                email,
                password: hashPassword,
            });

            const payload: TJwtPayload = {
                userId: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.signAccessToken(payload);
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const expiresAt = new Date(Date.now() + MS_IN_YEAR);
            const token = await this.tokenService.save({ user, expiresAt });
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
                user,
                message: "User register successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async self(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.auth.userId;
        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));
            return res.json({ user });
        } catch (error) {
            return next(error);
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        const tokenId = Number(req.auth.tokenId);

        try {
            await this.tokenService.delete(Number(tokenId));

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            return res.json({
                user: null,
                message: "User successfully logout.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async login(
        req: AuthRequest<LoginRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const { email, password } = req.body;

        let user;
        try {
            user = await this.userService.getByEmail(email);
            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or Password does not match!",
                );
                return next(error);
            }
            const isMatch = await this.credentialService.hashCompare(
                password,
                user.password,
            );

            if (!isMatch)
                return next(
                    createHttpError(400, "Email or Password does not match!"),
                );
        } catch (error) {
            return next(error);
        }

        try {
            const payload: TJwtPayload = {
                userId: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.signAccessToken(payload);
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const expiresAt = new Date(Date.now() + MS_IN_YEAR);
            const token = await this.tokenService.save({ user, expiresAt });
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
        } catch (error) {
            return next(error);
        }

        return res.json({
            user,
            message: "User login successfully.",
        });
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        const auth = req.auth;

        let user;
        try {
            user = await this.userService.getById(Number(auth.userId));
            if (!user) {
                const error = createHttpError(
                    400,
                    "User whit token could not found!",
                );
                return next(error);
            }
            await this.tokenService.delete(Number(auth.tokenId));
        } catch (error) {
            return next(error);
        }

        try {
            const payload: TJwtPayload = {
                userId: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.signAccessToken(payload);
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const expiresAt = new Date(Date.now() + MS_IN_YEAR);
            const token = await this.tokenService.save({ user, expiresAt });
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
            return res.json({ user });
        } catch (error) {
            return next(error);
        }
    }

    async forgetPassword(
        req: AuthRequest<ForgetPasswordRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const { email } = req.body;

        try {
            const user = await this.userService.getByEmail(email);
            if (!user) {
                return next(
                    createHttpError(400, "This email is not registered!"),
                );
            }

            const ttl = 1000 * 60 * 10;
            const expires = Date.now() + ttl;
            const otp = this.credentialService.getOtp();
            const prepareDataForHash = `${otp}.${email}.${expires}`;
            const hashOtpData =
                this.credentialService.hashDataWithSecret(prepareDataForHash);
            const hashOtp = `${hashOtpData}#${expires}`;

            const otpInfo = {
                fullName: user.fullName,
                email,
                hashOtp,
            };
            return res.json({
                otpInfo,
                otp,
                message: `Otp sent to email ${email} successfully.`,
            });
        } catch (error) {
            return next(error);
        }
    }

    async setPassword(
        req: AuthRequest<SetPasswordRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ error: result.array() });
        }

        const { email, hashOtp, otp, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            const err = createHttpError(
                400,
                "confirm password not match to password!",
            );
            return next(err);
        }

        if (hashOtp.split("#").length !== 2) {
            const error = createHttpError(400, "Otp is invalid!");
            return next(error);
        }

        const [prevHashedOtp, expires] = hashOtp.split("#");
        try {
            const user = await this.userService.getByEmail(email);
            if (!user) {
                return next(
                    createHttpError(400, "This email is not registered!"),
                );
            }

            if (Date.now() > +expires) {
                const error = createHttpError(408, "Otp is expired!");
                return next(error);
            }

            const data = `${otp}.${email}.${expires}`;
            const hashData = this.credentialService.hashDataWithSecret(data);

            if (hashData !== prevHashedOtp) {
                const error = createHttpError(400, "Otp is invalid!");
                return next(error);
            }

            const hashPassword =
                await this.credentialService.hashData(password);
            user.password = hashPassword;
            await this.userService.save(user);

            return res.json({ user });
        } catch (error) {
            return next(error);
        }
    }
}

export default AuthController;
