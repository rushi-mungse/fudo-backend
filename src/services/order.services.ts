import { Repository } from "typeorm";
import { Order } from "../entity";
import { OrderData } from "../types";

class OrderService {
    constructor(private orderRepository: Repository<Order>) {}

    async saveOrder(order: OrderData) {
        return await this.orderRepository.save(order);
    }
}

export default OrderService;
