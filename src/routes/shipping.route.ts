import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { ShippingController } from "../controllers";
import { checkAccessToken, hasPermission } from "../middlewares";
import { postShippingValidator } from "../validators/shipping";
import { ShippingService, UserService } from "../services";
import { AppDataSource } from "../config/config";
import { Shipping, User } from "../entity";
import { UserRole } from "../constants";
import { AuthRequest, ShippingData } from "../types/type";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const shippingRepository = AppDataSource.getRepository(Shipping);
const shippingService = new ShippingService(shippingRepository);
const shippingController = new ShippingController(userService, shippingService);

router.post(
    "/",
    postShippingValidator,
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.postShipping(
            req as AuthRequest<ShippingData>,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.delete(
    "/:shippingId",
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.deleteShipping(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/",
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.getShippings(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/:shippingId",
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.getShipping(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/:shippingId",
    postShippingValidator,
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.updateShipping(
            req as AuthRequest<ShippingData>,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/admin/all-shippings",
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.getAllShippings(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.delete(
    "/admin/:shippingId",
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        shippingController.deleteShippingByAdmin(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
