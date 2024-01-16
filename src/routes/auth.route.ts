import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AuthController } from "../controllers";
import {
    forgetPasswordValidator,
    loginValidator,
    sendOtpValidator,
    verifyOtpValidator,
} from "../validators/auth";
import {
    AuthRequest,
    ForgetPasswordRequest,
    LoginRequest,
    SendOtpRequest,
    VerifyOtpRequest,
} from "../types";
import { CredentialService, TokenService, UserService } from "../services";
import { AppDataSource, logger } from "../config";
import { Token, User } from "../entity";
import {
    checkAccessToken,
    checkInvalidRefreshToken,
    checkRefreshToken,
} from "../middlewares";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const tokenRepository = AppDataSource.getRepository(Token);
const userService = new UserService(userRepository);
const tokenService = new TokenService(tokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
    logger,
    userService,
    credentialService,
    tokenService,
);

router.post(
    "/register/send-otp",
    sendOtpValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.sendOtp(
            req as SendOtpRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/register/verify-otp",
    verifyOtpValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.verifyOtp(
            req as VerifyOtpRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/self",
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        authController.self(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/logout",
    [checkAccessToken, checkRefreshToken],
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/login",
    loginValidator,
    [checkInvalidRefreshToken],
    (req: LoginRequest, res: Response, next: NextFunction) =>
        authController.login(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/refresh",
    [checkRefreshToken],
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/forget-password",
    forgetPasswordValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.forgetPassword(
            req as ForgetPasswordRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
