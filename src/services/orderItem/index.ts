import { Repository } from "typeorm";
import { OrderItem } from "../../entity";
import { OrderItemData } from "../../types";
import ProductService from "../product";

class OrderItemservice {
    constructor(
        private productService: ProductService,
        private orderItemRepository: Repository<OrderItem>,
    ) {}

    async saveOrderItem(orderItem: OrderItemData): Promise<OrderItem> {
        return await this.orderItemRepository.save(orderItem);
    }
}

export default OrderItemservice;
