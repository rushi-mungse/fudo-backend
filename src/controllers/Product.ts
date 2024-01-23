import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { Category, Price, Product, Size } from "../entity";
import {
    AuthRequest,
    CategoryData,
    CategoryServiceType,
    PriceData,
    ProductData,
    ProductRequestBody,
    ProductSizeData,
    ProductSizeServiceType,
    Service,
    SizeAndPriceData,
} from "../types/type";

class ProductController {
    constructor(
        private productService: Service<Product, ProductData>,
        private categoryService: CategoryServiceType<Category, CategoryData>,
        private sizeService: ProductSizeServiceType<Size, ProductSizeData>,
        private priceService: Service<Price, PriceData>,
    ) {}

    async createProduct(
        req: AuthRequest<ProductRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const file = req.file;
        if (!file) return next(createHttpError(400, "Product image not found"));

        const {
            name,
            description,
            discount,
            availability,
            ingredients,
            preparationTime,
            sizeAndPrices: sizeAndPriceStr,
            categoryName,
            currency,
        } = req.body;

        try {
            const category =
                await this.categoryService.getByCategoryName(categoryName);
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            const prices: Price[] = [];
            const sizeAndPriceObject = JSON.parse(
                sizeAndPriceStr,
            ) as SizeAndPriceData;

            for (const sizeName in sizeAndPriceObject) {
                const productPrice = Number(sizeAndPriceObject[sizeName]);
                const size =
                    await this.sizeService.getByProductSizeName(sizeName);
                if (!size)
                    return next(
                        createHttpError(400, "Product Size not found!"),
                    );

                const price = await this.priceService.save({
                    size,
                    price: productPrice,
                    currency,
                });

                prices.push(price);
            }

            const product = await this.productService.save({
                name,
                description,
                discount: Number(discount),
                availability: String(availability) === "true" ? true : false,
                ingredients: JSON.parse(ingredients) as string[],
                preparationTime: Number(preparationTime),
                imageUrl: file.path,
                categories: [category],
                prices,
            });

            res.status(201).json({
                product,
                message: "Product created successfully.",
            });
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await this.productService.gets();
            return res.json({
                products,
                message: "all product featched successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
        const productId = req.params.productId;
        if (isNaN(Number(productId)))
            return next(createHttpError(400, "Invalid product id!"));

        try {
            const product = await this.productService.getById(
                Number(productId),
            );
            if (!product) {
                return next(createHttpError(400, "Product not found!"));
            }

            await this.productService.delete(Number(productId));
        } catch (error) {
            return next(error);
        }
        res.json({ productId, message: "Product deleted successfully." });
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.productId;
        if (isNaN(Number(productId)))
            return next(createHttpError(400, "Invalid product Id"));

        try {
            const product = await this.productService.getById(
                Number(productId),
            );
            if (!product) next(createHttpError(400, "Product not found!"));

            return res.json({ product });
        } catch (error) {
            return next(error);
        }
    }

    async updateProduct(
        req: AuthRequest<ProductRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const productId = req.params.productId;
        if (isNaN(Number(productId)))
            return next(createHttpError(400, "Invalid product id!"));

        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const file = req.file;

        const {
            name,
            description,
            availability,
            preparationTime,
            discount,
            categoryName,
            ingredients,
        } = req.body;

        try {
            const product = await this.productService.getById(
                Number(productId),
            );
            if (!product)
                return next(createHttpError(400, "Product not found!"));

            const category =
                await this.categoryService.getByCategoryName(categoryName);
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            product.name = name;
            product.description = description;
            product.discount = Number(discount);
            product.availability =
                String(availability) === "true" ? true : false;
            product.ingredients = JSON.parse(ingredients) as string[];
            product.preparationTime = Number(preparationTime);
            // product.category = category;
            if (file) product.imageUrl = file.path;

            await this.productService.save(product);

            return res.json({
                product,
                message: "Product updated successfully.",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ProductController;
