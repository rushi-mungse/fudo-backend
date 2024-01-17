import { Response, NextFunction } from "express";
import { PostShippingRequest } from "../types";
import { validationResult } from "express-validator";
import { ShippingService, UserService } from "../services";
import createHttpError from "http-errors";

class ShippingController {
    constructor(
        private userService: UserService,
        private shippingService: ShippingService,
    ) {}

    async postShipping(
        req: PostShippingRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;
        const { address, city, postalCode } = req.body;

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            await this.shippingService.saveShipping({
                address,
                city,
                postalCode,
                user,
            });

            const newUser = await this.userService.findUserById(Number(userId));
            return res.json({
                user: { ...newUser, password: null },
                message: "Shipping address added successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default ShippingController;
