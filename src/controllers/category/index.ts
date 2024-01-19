import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../../services";
import { validationResult } from "express-validator";
import { CreateCategoryRequest } from "../../types";
import createHttpError from "http-errors";

class CategoryController {
    constructor(private categoryService: CategoryService) {}

    async create(
        req: CreateCategoryRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const { name } = req.body;
        try {
            const category = await this.categoryService.saveCategory({ name });
            return res.status(201).json({
                category,
                message: "Product category created successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await this.categoryService.getCategories();
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
            const category = await this.categoryService.findCategoryById(
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

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId = req.params.categoryId;
        if (isNaN(Number(categoryId)))
            return next(createHttpError(400, "Invalid category id!"));

        try {
            const category = await this.categoryService.findCategoryById(
                Number(categoryId),
            );
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            await this.categoryService.deleteCategory(Number(categoryId));
            return res.json({
                id: categoryId,
                message: "Product category deleted successfully",
            });
        } catch (error) {
            return next(error);
        }
    }

    async updateCategory(
        req: CreateCategoryRequest,
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
            const category = await this.categoryService.findCategoryById(
                Number(categoryId),
            );

            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            category.name = name;
            await this.categoryService.saveCategory(category);

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
