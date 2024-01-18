import { Response, NextFunction } from "express";
import { AuthRequest, PostShippingRequest } from "../types";
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

    async deleteShipping(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.auth.userId;

        const shippingId = req.params.shippingId;
        if (isNaN(Number(shippingId)))
            return next(createHttpError(400, "Shipping id is invalid!"));

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shipping =
                await this.shippingService.findShippingByIdWithRelations(
                    Number(shippingId),
                );
            if (!shipping)
                return next(
                    createHttpError(400, "Shipping address not found!"),
                );

            if (shipping.user.id !== user.id)
                return next(
                    createHttpError(
                        400,
                        "This shipping address not belong to the user!",
                    ),
                );

            await this.shippingService.deleteShippingById(Number(shippingId));
            return res.json({
                id: shippingId,
                message: "Shipping address deleted successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async getShippings(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.auth.userId;
        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shippings = await this.shippingService.findShippings(
                Number(userId),
            );

            return res.json({ userId, shippings });
        } catch (error) {
            return next(error);
        }
    }
}

export default ShippingController;
