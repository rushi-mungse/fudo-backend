import { NextFunction, Request, Response } from "express";
import { SizeService } from "../../services";
import { AddProductSizeRequest } from "../../types";

class SizeController {
    constructor(private sizeService: SizeService) {}

    async addProductSize(
        req: AddProductSizeRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { size } = req.body;
        try {
            const productSize = await this.sizeService.saveSize(size);
            return res.json({ productSize, message: "Product size added!" });
        } catch (error) {
            return next(error);
        }
    }
}

export default SizeController;
