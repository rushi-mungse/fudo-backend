import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { ProductController } from "../controllers";
import { CreateProductRequest } from "../types";
import {
    CategoryService,
    ProductService,
    SizeAndPriceService,
} from "../services";
import { AppDataSource } from "../config";
import { Category, Product, SizeAndPrice } from "../entity";
import { UserRole } from "../constants";
import { checkAccessToken, hasPermission, uploadFile } from "../middlewares";
import { createProductValidator } from "../validators/product";

const router = express.Router();

const categoryRepository = AppDataSource.getRepository(Category);
const categoryService = new CategoryService(categoryRepository);

const sizeAndPriceRepository = AppDataSource.getRepository(SizeAndPrice);
const sizeAndPriceService = new SizeAndPriceService(sizeAndPriceRepository);

const productRepository = AppDataSource.getRepository(Product);
const productService = new ProductService(productRepository);
const productController = new ProductController(
    productService,
    categoryService,
    sizeAndPriceService,
);

router.post(
    "/",
    [
        checkAccessToken,
        uploadFile.single("image"),
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
        createProductValidator as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        productController.createProduct(
            req as CreateProductRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) =>
        productController.getProducts(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/:productId",
    (req: Request, res: Response, next: NextFunction) =>
        productController.getProduct(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.delete(
    "/:productId",
    [
        checkAccessToken,
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        productController.deleteProduct(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/:productId",
    [
        checkAccessToken,
        uploadFile.single("image"),
        hasPermission([UserRole.ADMIN]) as unknown as RequestHandler,
        createProductValidator as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        productController.updateProduct(
            req as CreateProductRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
