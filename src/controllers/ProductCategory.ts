import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category } from "../entity";
import {
    AuthRequest,
    CategoryData,
    CategoryServiceType,
    CreateCategoryRequestBody,
} from "../types/type";

class CategoryController {
    constructor(
        private categoryService: CategoryServiceType<Category, CategoryData>,
    ) {}

    async create(
        req: AuthRequest<CreateCategoryRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const { name } = req.body;
        try {
            const category = await this.categoryService.save({ name });
            return res.status(201).json({
                category,
                message: "Product category created successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async gets(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await this.categoryService.gets();
            return res.json({ categories });
        } catch (error) {
            return next(error);
        }
    }

    async getCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId = req.params.categoryId;
        if (isNaN(Number(categoryId)))
            return next(createHttpError(400, "Invalid category id!"));
        try {
            const category = await this.categoryService.getById(
                Number(categoryId),
            );
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );
            return res.json({ category });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const categoryId = req.params.categoryId;
        if (isNaN(Number(categoryId)))
            return next(createHttpError(400, "Invalid category id!"));

        try {
            const category = await this.categoryService.getById(
                Number(categoryId),
            );
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            await this.categoryService.delete(Number(categoryId));
            return res.json({
                id: categoryId,
                message: "Product category deleted successfully",
            });
        } catch (error) {
            return next(error);
        }
    }

    async updateCategory(
        req: AuthRequest<CreateCategoryRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const categoryId = req.params.categoryId;
        if (isNaN(Number(categoryId)))
            return next(createHttpError(400, "Invalid category id!"));

        const { name } = req.body;
        try {
            const category = await this.categoryService.getById(
                Number(categoryId),
            );

            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            category.name = name;
            await this.categoryService.save(category);

            return res.json({
                category,
                message: "Product category updated successfully",
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default CategoryController;
