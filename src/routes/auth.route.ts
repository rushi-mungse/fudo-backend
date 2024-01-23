import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AuthController } from "../controllers";
import { CredentialService, TokenService, UserService } from "../services";
import { AppDataSource, logger } from "../config";
import { Token, User } from "../entity";
import {
    forgetPasswordValidator,
    loginValidator,
    sendOtpValidator,
    verifyOtpValidator,
} from "../validators/auth";
import {
    checkAccessToken,
    checkInvalidRefreshToken,
    checkRefreshToken,
} from "../middlewares";
import {
    AuthRequest,
    ForgetPasswordRequestBody,
    LoginRequestBody,
    SendOtpRequestBody,
    SetPasswordRequestBody,
    VerifyOtpRequestBody,
} from "../types/type";

const router = express.Router();

const credentialService = new CredentialService();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const tokenRepository = AppDataSource.getRepository(Token);
const tokenService = new TokenService(tokenRepository);

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
            req as AuthRequest<SendOtpRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/register/verify-otp",
    verifyOtpValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.verifyOtp(
            req as AuthRequest<VerifyOtpRequestBody>,
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
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(
            req as AuthRequest<LoginRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
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
            req as AuthRequest<ForgetPasswordRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/set-password",
    verifyOtpValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.setPassword(
            req as AuthRequest<SetPasswordRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
