import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { Order, OrderItem, Payment, Product, Shipping, User } from "../entity";
import { OrderController } from "../controllers";
import {
    OrderItemservice,
    OrderService,
    PaymentService,
    ProductService,
    ShippingService,
    UserService,
} from "../services";
import { AppDataSource } from "../config";
import { checkAccessToken } from "../middlewares";
import { orderItemsValidator } from "../validators/order";
import { AuthRequest, AddOrderRequestBody } from "../types/type";

const router = express.Router();

const productRepository = AppDataSource.getRepository(Product);
const productService = new ProductService(productRepository);

const paymentRepository = AppDataSource.getRepository(Payment);
const paymentService = new PaymentService(paymentRepository);

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const shippingRepository = AppDataSource.getRepository(Shipping);
const shippingService = new ShippingService(shippingRepository);

const orderItemRepository = AppDataSource.getRepository(OrderItem);
const orderItemService = new OrderItemservice(orderItemRepository);

const orderRepository = AppDataSource.getRepository(Order);
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(
    userService,
    productService,
    orderService,
    orderItemService,
    shippingService,
    paymentService,
);

router.post(
    "/",
    orderItemsValidator,
    [checkAccessToken],
    (req: Request, res: Response, next: NextFunction) =>
        orderController.addOrder(
            req as AuthRequest<AddOrderRequestBody>,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
