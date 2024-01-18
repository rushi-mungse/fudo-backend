import { Repository } from "typeorm";
import { Shipping } from "../entity";
import { ShippingData } from "../types";

class ShippingService {
    constructor(private shippingRepository: Repository<Shipping>) {}

    async saveShipping(shipping: ShippingData) {
        return await this.shippingRepository.save(shipping);
    }

    async findShippingById(shippingId: number) {
        return await this.shippingRepository.findOne({
            where: { id: shippingId },
        });
    }

    async deleteShippingById(shippingId: number) {
        await this.shippingRepository.delete(shippingId);
    }

    async findShippingByIdWithRelations(shippingId: number) {
        return await this.shippingRepository.findOne({
            where: { id: shippingId },
            relations: ["user"],
        });
    }
}

export default ShippingService;
