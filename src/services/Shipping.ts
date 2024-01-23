import { Repository } from "typeorm";
import { Shipping } from "../entity";
import { ShippingData, ShippingServiceType } from "../types/type";

class ShippingService implements ShippingServiceType<Shipping, ShippingData> {
    constructor(private shippingRepository: Repository<Shipping>) {}

    async save(shipping: ShippingData): Promise<Shipping> {
        return await this.shippingRepository.save(shipping);
    }

    async getById(shippingId: number): Promise<Shipping | null> {
        return await this.shippingRepository.findOne({
            where: { id: shippingId },
            relations: {
                user: true,
            },
        });
    }

    async delete(shippingId: number): Promise<void> {
        await this.shippingRepository.delete(shippingId);
    }

    async getsByUserId(userId: number): Promise<Shipping[]> {
        return await this.shippingRepository.find({
            where: { user: { id: userId } },
        });
    }

    async gets(): Promise<Shipping[]> {
        return await this.shippingRepository.find({
            relations: { user: true },
        });
    }

    async getsShippingsByUserId(
        shippingId: number,
        userId: number,
    ): Promise<Shipping | null> {
        return await this.shippingRepository.findOne({
            where: {
                id: shippingId,
                user: { id: userId },
            },
        });
    }
}

export default ShippingService;
