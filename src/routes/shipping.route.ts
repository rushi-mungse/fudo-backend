import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { ShippingController } from "../controllers";
import { checkAccessToken } from "../middlewares";
import { PostShippingRequest } from "../types";
import { postShippingValidator } from "../validators/shipping";
import { ShippingService, UserService } from "../services";
import { AppDataSource } from "../config";
import { Shipping, User } from "../entity";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const shippingRepository = AppDataSource.getRepository(Shipping);
const userService = new UserService(userRepository);
const shippingService = new ShippingService(shippingRepository);
const shippingController = new ShippingController(userService, shippingService);

router.post(
    "/",
    postShippingValidator,
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.postShipping(
            req as PostShippingRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
