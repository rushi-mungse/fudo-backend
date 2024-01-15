import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AuthController } from "../controllers";
import { sendOtpValidator, verifyOtpValidator } from "../validators/auth";
import { SendOtpRequest, VerifyOtpRequest } from "../types";
import { CredentialService, TokenService, UserService } from "../services";
import { AppDataSource, logger } from "../config";
import { Token, User } from "../entity";

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

export default router;
