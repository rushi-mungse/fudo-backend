import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import {
    OrderItemservice,
    OrderService,
    ShippingService,
    UserService,
    PaymentService,
    ProductService,
} from "../../services";
import { CartData, OrderItemRequest } from "../../types";
import { OrderItem } from "../../entity";
import { PaymentMethod } from "../../constants";

class OrderController {
    constructor(
        private userService: UserService,
        private productSevice: ProductService,
        private orderService: OrderService,
        private orderItemService: OrderItemservice,
        private shippingService: ShippingService,
        private paymentService: PaymentService,
    ) {}

    async addOrderItems(
        req: OrderItemRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;
        const { cart, shippingId } = req.body;

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shipping = await this.shippingService.findShippingWithUserId(
                Number(shippingId),
                Number(userId),
            );
            if (!shipping)
                return next(
                    createHttpError(400, "Shipping address not found!"),
                );

            const itemData = JSON.parse(cart) as CartData;
            const orderItems: OrderItem[] = [];

            let totalAmount = 0;

            for (const productId in itemData) {
                const product = await this.productSevice.findProductById(
                    Number(productId),
                );
                if (!product)
                    return next(createHttpError(400, "Product not found!"));

                const quantity = itemData[productId].quantity;
                const size = itemData[productId].size;
                const orderItem = await this.orderItemService.saveOrderItem({
                    product,
                    quantity,
                });
                const prices = orderItem.product.prices;
                prices.forEach((price) => {
                    if (price.size.size === size)
                        totalAmount += price.price * quantity;
                });
                orderItems.push(orderItem);
            }

            const payment = await this.paymentService.orderPayment({
                amount: totalAmount,
                method: PaymentMethod.NET_BANKING,
            });

            const order = await this.orderService.saveOrder({
                user,
                orderItems,
                shipping,
                payment,
            });

            return res.json({
                order,
                message: "🔥 Items ordered placed successefully",
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default OrderController;
