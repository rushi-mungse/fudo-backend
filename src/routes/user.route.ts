import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { AppDataSource, logger } from "../config";
import { UserController } from "../controllers";
import { checkAccessToken } from "../middlewares";
import { UserService, CredentialService } from "../services";
import { User } from "../entity";
import { UpdateUserFullNameRequest } from "../types";
import { updateUserFullNameValidator } from "../validators/user";

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

export default router;
