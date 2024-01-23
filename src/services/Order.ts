import { Repository } from "typeorm";
import { Order } from "../entity";
import { OrderData, OrderServiceType } from "../types/type";

class OrderService implements OrderServiceType<Order, OrderData> {
    constructor(private orderRepository: Repository<Order>) {}

    async save(order: OrderData) {
        return await this.orderRepository.save(order);
    }

    async gets(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: {
                payment: true,
                shipping: true,
                user: true,
                orderItems: true,
            },
        });
    }

    async getById(orderId: number): Promise<Order | null> {
        return await this.orderRepository.findOne({
            relations: {
                payment: true,
                shipping: true,
                user: true,
                orderItems: true,
            },
        });
    }

    async delete(orderId: number): Promise<void> {
        await this.orderRepository.delete(orderId);
    }

    async getsByUserId(userId: number): Promise<Order[]> {
        return await this.orderRepository.find({
            where: {
                user: { id: userId },
            },
            relations: {
                payment: true,
                shipping: true,
                user: true,
                orderItems: true,
            },
        });
    }
}

export default OrderService;
