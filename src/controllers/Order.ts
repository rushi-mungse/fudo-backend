import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { PaymentMethod } from "../constants";
import { Order, OrderItem, Payment, Product, Shipping, User } from "../entity";
import {
    AuthRequest,
    CartData,
    OrderData,
    OrderItemData,
    OrderItemsRequestBody,
    PaymentData,
    ProductData,
    Service,
    ShippingData,
    ShippingServiceType,
    UserData,
    UserServiceType,
} from "../types/type";

class OrderController {
    constructor(
        private userService: UserServiceType<User, UserData>,
        private productSevice: Service<Product, ProductData>,
        private orderService: Service<Order, OrderData>,
        private orderItemService: Service<OrderItem, OrderItemData>,
        private shippingService: ShippingServiceType<Shipping, ShippingData>,
        private paymentService: Service<Payment, PaymentData>,
    ) {}

    async addOrderItems(
        req: AuthRequest<OrderItemsRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;
        const { cart, shippingId } = req.body;

        try {
            const user = await this.userService.getById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const shipping = await this.shippingService.getsShippingsByUserId(
                Number(userId),
                Number(shippingId),
            );
            if (!shipping)
                return next(
                    createHttpError(400, "Shipping address not found!"),
                );

            const itemData = JSON.parse(cart) as CartData;
            const orderItems: OrderItem[] = [];

            let totalAmount = 0;

            for (const productId in itemData) {
                const product = await this.productSevice.getById(
                    Number(productId),
                );
                if (!product)
                    return next(createHttpError(400, "Product not found!"));

                const quantity = itemData[productId].quantity;
                const size = itemData[productId].size;
                const orderItem = await this.orderItemService.save({
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

            const payment = await this.paymentService.save({
                amount: totalAmount,
                method: PaymentMethod.NET_BANKING,
            });

            const order = await this.orderService.save({
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
