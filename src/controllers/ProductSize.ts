import { NextFunction, Response } from "express";
import { Size, User } from "../entity";
import {
    AddProductSizeRequestBody,
    AuthRequest,
    ProductSizeData,
    ProductSizeServiceType,
    UserData,
    UserServiceType,
} from "../types/type";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

class SizeController {
    constructor(
        private userService: UserServiceType<User, UserData>,
        private sizeService: ProductSizeServiceType<Size, ProductSizeData>,
    ) {}

    async addProductSize(
        req: AuthRequest<AddProductSizeRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;

        const { size } = req.body;
        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found"));

            const productSize = await this.sizeService.save({ size });
            return res.json({ productSize, message: "Product size added!" });
        } catch (error) {
            return next(error);
        }
    }

    async deleteProductSize(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        const productSizeId = req.params.productSizeId;
        if (isNaN(Number(productSizeId)))
            return next(createHttpError(400, "Invalid product size id!"));

        const userId = req.auth.userId;

        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found"));

            const size = await this.sizeService.getById(Number(productSizeId));
            if (!size)
                return next(createHttpError(400, "Product size not found!"));

            await this.sizeService.delete(Number(productSizeId));
            return res.json({
                message: "Product size deleted successfully.",
                id: productSizeId,
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default SizeController;
