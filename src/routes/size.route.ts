import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { Size, User } from "../entity";
import { SizeController } from "../controllers";
import { SizeService, UserService } from "../services";
import { AppDataSource } from "../config";
import { checkAccessToken } from "../middlewares";
import { AddProductSizeRequestBody, AuthRequest } from "../types/type";
import { addProductSizeValidator } from "../validators/size";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const sizeRepository = AppDataSource.getRepository(Size);
const sizeService = new SizeService(sizeRepository);
const sizeController = new SizeController(userService, sizeService);

router.post(
    "/",
    addProductSizeValidator,
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        sizeController.addProductSize(
            req as AuthRequest<AddProductSizeRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.delete(
    "/:productSizeId",
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        sizeController.deleteProductSize(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);
export default router;
