import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { ProductController } from "../controllers";
import {
    CategoryService,
    PriceService,
    ProductService,
    SizeService,
} from "../services";
import { AppDataSource } from "../config/config";
import { Category, Price, Product, Size } from "../entity";
import { UserRole } from "../constants";
import { checkAccessToken, hasPermission, uploadFile } from "../middlewares";
import {
    createProductValidator,
    updateProductValidator,
} from "../validators/product";
import { AuthRequest, ProductRequestBody } from "../types/type";

const router = express.Router();

const categoryRepository = AppDataSource.getRepository(Category);
const categoryService = new CategoryService(categoryRepository);

const sizeRepository = AppDataSource.getRepository(Size);
const sizeService = new SizeService(sizeRepository);

const priceRepository = AppDataSource.getRepository(Price);
const priceService = new PriceService(priceRepository);

const productRepository = AppDataSource.getRepository(Product);
const productService = new ProductService(productRepository);
const productController = new ProductController(
    productService,
    categoryService,
    sizeService,
    priceService,
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
            req as AuthRequest<ProductRequestBody>,
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
            req as AuthRequest,
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
        updateProductValidator as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        productController.updateProduct(
            req as AuthRequest<ProductRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
