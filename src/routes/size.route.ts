import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { Size } from "../entity";
import { SizeController } from "../controllers";
import { SizeService } from "../services";
import { AppDataSource } from "../config";
import { checkAccessToken } from "../middlewares";
import { AddProductSizeRequest } from "../types";

const router = express.Router();

const sizeRepository = AppDataSource.getRepository(Size);
const sizeService = new SizeService(sizeRepository);
const sizeController = new SizeController(sizeService);

router.post(
    "/",
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        sizeController.addProductSize(
            req as AddProductSizeRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
