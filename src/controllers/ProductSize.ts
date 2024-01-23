import { NextFunction, Response } from "express";
import { Size } from "../entity";
import {
    AddProductSizeRequestBody,
    AuthRequest,
    ProductSizeData,
    ProductSizeServiceType,
} from "../types/type";

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
}

export default SizeController;
