import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AppDataSource } from "../config";
import { Category } from "../entity";
import { UserRole } from "../constants";
import { CategoryService } from "../services";
import { CategoryController } from "../controllers";
import { checkAccessToken, hashPermission } from "../middlewares";
import { categoryValidator } from "../validators/category";

const router = express.Router();
const categoryRepository = AppDataSource.getRepository(Category);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get(
    "/",
    (req, res, next) =>
        categoryController.getCategories(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
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
        hashPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.create(req, res, next) as unknown as RequestHandler,
);

router.delete(
    "/:categoryId",
    [
        checkAccessToken,
        hashPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.deleteCategory(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/:categoryId",
    categoryValidator,
    [
        checkAccessToken,
        hashPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.updateCategory(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
