import { Repository } from "typeorm";
import { OrderItem, Product } from "../entity";
import { OrderItemData, ProductData, Service } from "../types/type";

class OrderItemservice implements Service<OrderItem, OrderItemData> {
    constructor(private orderItemRepository: Repository<OrderItem>) {}

    async save(orderItem: OrderItemData): Promise<OrderItem> {
        return await this.orderItemRepository.save(orderItem);
    }

    async getById(orderItemId: number): Promise<OrderItem | null> {
        return await this.orderItemRepository.findOne({
            where: { id: orderItemId },
        });
    }

    async gets(): Promise<OrderItem[]> {
        return await this.orderItemRepository.find();
    }

    async delete(orderItemId: number): Promise<void> {
        await this.orderItemRepository.delete(orderItemId);
    }
}

export default OrderItemservice;
