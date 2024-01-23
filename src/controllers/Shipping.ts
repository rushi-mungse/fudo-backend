import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { Shipping, User } from "../entity";
import {
    AuthRequest,
    ShippingData,
    ShippingServiceType,
    UserData,
    UserServiceType,
} from "../types/type";

class ShippingController {
    constructor(
        private userService: UserServiceType<User, UserData>,
        private shippingService: ShippingServiceType<Shipping, ShippingData>,
    ) {}

    async postShipping(
        req: AuthRequest<ShippingData>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;
        const { address, city, postalCode, country } = req.body;

        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const savedShipping = await this.shippingService.save({
                address,
                country,
                city,
                postalCode,
                user,
            });

            const shipping = await this.shippingService.getById(
                savedShipping.id,
            );

            return res.json({
                shipping,
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
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shipping = await this.shippingService.getById(
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

            await this.shippingService.delete(Number(shippingId));
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
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shippings = await this.shippingService.getsByUserId(
                Number(userId),
            );

            return res.json({ userId, shippings });
        } catch (error) {
            return next(error);
        }
    }

    async getShipping(req: AuthRequest, res: Response, next: NextFunction) {
        const shippingId = req.params.shippingId;
        if (isNaN(Number(shippingId)))
            return next(createHttpError(400, "Shipping id is invalid!"));

        const userId = req.auth.userId;
        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shipping = await this.shippingService.getById(
                Number(shippingId),
            );

            return res.json({ userId, shipping });
        } catch (error) {
            return next(error);
        }
    }

    async updateShipping(
        req: AuthRequest<ShippingData>,
        res: Response,
        next: NextFunction,
    ) {
        const shippingId = req.params.shippingId;
        if (isNaN(Number(shippingId)))
            return next(createHttpError(400, "Invalid shipping id!"));

        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;
        const { address, city, postalCode, country } = req.body;

        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shipping = await this.shippingService.getById(
                Number(shippingId),
            );
            if (!shipping)
                return next(
                    createHttpError(400, "Shipping address not found!"),
                );

            shipping.address = address;
            shipping.city = city;
            shipping.country = country;
            shipping.postalCode = postalCode;

            await this.shippingService.save(shipping);

            return res.json({
                shipping,
                message: "Shipping address added successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async getAllShippings(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.auth.userId;
        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shippings = await this.shippingService.gets();
            return res.json({ shippings });
        } catch (error) {
            return next(error);
        }
    }

    async deleteShippingByAdmin(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        const shippingId = req.params.shippingId;
        if (isNaN(Number(shippingId)))
            return next(createHttpError(400, "Shipping id is invalid!"));

        try {
            const shipping = await this.shippingService.getById(
                Number(shippingId),
            );
            if (!shipping)
                return next(
                    createHttpError(400, "Shipping address not found!"),
                );

            await this.shippingService.delete(Number(shippingId));
            return res.json({
                id: shippingId,
                message: "Shipping address deleted successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default ShippingController;
