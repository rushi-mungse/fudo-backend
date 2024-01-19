import { Repository } from "typeorm";
import { OrderItem, Product } from "../entity";
import { OrderItemData } from "../types";
import createHttpError from "http-errors";
import ProductService from "./product.services";

class OrderItemservice {
    constructor(
        private productService: ProductService,
        private orderItemRepository: Repository<OrderItem>,
    ) {}

    async saveOrderItem(orderItem: OrderItemData): Promise<OrderItem> {
        return await this.orderItemRepository.save(orderItem);
    }

    async createOrderItem(
        productId: number,
        quantity: number,
    ): Promise<OrderItem> {
        const product = await this.productService.findProductById(productId);
        if (!product) throw createHttpError(400, "Product not found!");

        const orderItem = await this.orderItemRepository.save({
            product,
            quantity,
        });

        return orderItem;
    }
}

export default OrderItemservice;
