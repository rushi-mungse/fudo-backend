import { Repository } from "typeorm";
import { Shipping } from "../../entity";
import { ShippingData } from "../../types";

class ShippingService {
    constructor(private shippingRepository: Repository<Shipping>) {}

    async saveShipping(shipping: ShippingData): Promise<Shipping> {
        return await this.shippingRepository.save(shipping);
    }

    async findShippingById(shippingId: number): Promise<Shipping | null> {
        return await this.shippingRepository.findOne({
            where: { id: shippingId },
        });
    }

    async deleteShippingById(shippingId: number): Promise<void> {
        await this.shippingRepository.delete(shippingId);
    }

    async findShippingByIdWithRelations(
        shippingId: number,
    ): Promise<Shipping | null> {
        return await this.shippingRepository.findOne({
            where: { id: shippingId },
            relations: ["user"],
        });
    }

    async findShippings(userId: number): Promise<Shipping[]> {
        return await this.shippingRepository.find({
            where: { user: { id: userId } },
        });
    }

    async getAllShippings(): Promise<Shipping[]> {
        return await this.shippingRepository.find({ relations: ["user"] });
    }

    async findShippingWithUserId(
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
