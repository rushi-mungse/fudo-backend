import { NextFunction, Response } from "express";
import { Size } from "../entity";
import {
    AddProductSizeRequestBody,
    AuthRequest,
    ProductSizeData,
    ProductSizeServiceType,
} from "../types/type";
import createHttpError from "http-errors";

class SizeController {
    constructor(
        private sizeService: ProductSizeServiceType<Size, ProductSizeData>,
    ) {}

    async addProductSize(
        req: AuthRequest<AddProductSizeRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const { size } = req.body;
        try {
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

        try {
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
