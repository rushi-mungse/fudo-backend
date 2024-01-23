import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AppDataSource } from "../config/config";
import { Category } from "../entity";
import { UserRole } from "../constants";
import { CategoryService } from "../services";
import { CategoryController } from "../controllers";
import { checkAccessToken, hasPermission } from "../middlewares";
import { categoryValidator } from "../validators/category";
import { AuthRequest, CreateCategoryRequestBody } from "../types/type";

const router = express.Router();
const categoryRepository = AppDataSource.getRepository(Category);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get(
    "/",
    (req, res, next) =>
        categoryController.gets(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/:categoryId",
    (req, res, next) =>
        categoryController.getCategory(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.put(
    "/",
    categoryValidator,
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.create(
            req as AuthRequest<CreateCategoryRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.delete(
    "/:categoryId",
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.delete(req, res, next) as unknown as RequestHandler,
);

router.post(
    "/:categoryId",
    categoryValidator,
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.updateCategory(
            req as AuthRequest<CreateCategoryRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
