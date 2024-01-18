import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { CreateProductRequest } from "../types";
import { CategoryService, ProductService } from "../services";

class ProductController {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
    ) {}

    async createProduct(
        req: CreateProductRequest,
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
            category: categoryName,
        } = req.body;

        try {
            const category =
                await this.categoryService.findCategoryByName(categoryName);
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            const product = await this.productService.saveProduct({
                name,
                description,
                discount: Number(discount),
                availability: String(availability) === "true" ? true : false,
                ingredients,
                preparationTime: Number(preparationTime),
                imageUrl: file.path,
                category,
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
            const products = await this.productService.getProducts();
            return res.json({
                products,
                message: "all product featched successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.productId;
        if (isNaN(Number(productId)))
            return next(createHttpError(400, "Invalid product id!"));

        try {
            const product = await this.productService.findProductById(
                Number(productId),
            );
            if (!product)
                return next(createHttpError(400, "Product not found!"));
            await this.productService.deleteProduct(Number(productId));
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
            const product = await this.productService.findProductById(
                Number(productId),
            );
            if (!product) next(createHttpError(400, "Product not found!"));

            return res.json({ product });
        } catch (error) {
            return next(error);
        }
    }

    async updateProduct(
        req: CreateProductRequest,
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
            category: categoryName,
            ingredients,
        } = req.body;

        try {
            const product = await this.productService.findProductById(
                Number(productId),
            );
            if (!product)
                return next(createHttpError(400, "Product not found!"));

            const category =
                await this.categoryService.findCategoryByName(categoryName);
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            product.name = name;
            product.description = description;
            product.discount = Number(discount);
            product.availability =
                String(availability) === "true" ? true : false;
            product.ingredients = ingredients;
            product.preparationTime = Number(preparationTime);
            // product.category = category;
            if (file) product.imageUrl = file.path;

            await this.productService.saveProduct(product);

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
