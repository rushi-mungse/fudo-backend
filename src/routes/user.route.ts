import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { AppDataSource, logger } from "../config/config";
import { UserController } from "../controllers";
import { checkAccessToken, hasPermission, uploadFile } from "../middlewares";
import { UserService, CredentialService } from "../services";
import { User } from "../entity";
import {
    AuthRequest,
    ChangePasswordRequest,
    UpdateUserFullNameRequest,
    UpdateUserRequest,
} from "../types";
import {
    changePasswordValidator,
    updateUserFullNameValidator,
    updateUserValidator,
} from "../validators/user";
import { UserRole } from "../constants";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const credentialService = new CredentialService();
const userController = new UserController(
    logger,
    userService,
    credentialService,
);

router.post(
    "/update-full-name",
    updateUserFullNameValidator,
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        userController.updateUserFullName(
            req as UpdateUserFullNameRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/change-password",
    changePasswordValidator,
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        userController.changePassword(
            req as ChangePasswordRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.delete(
    "/",
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        userController.deleteUser(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/update-profile-picture",
    [checkAccessToken, uploadFile.single("avatar")],
    (req: Request, res: Response, next: NextFunction) =>
        userController.updateUserProfilePicture(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/:userId",
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        userController.getUser(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/",
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        userController.getUsers(req, res, next) as unknown as RequestHandler,
);

router.delete(
    "/:userId",
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        userController.deleteUserByAdmin(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/:userId",
    updateUserValidator,
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        userController.updateUser(
            req as UpdateUserRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
