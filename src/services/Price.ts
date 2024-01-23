import { Repository } from "typeorm";
import { Price } from "../entity";
import { PriceData, Service } from "../types/type";

class PriceService implements Service<Price, PriceData> {
    constructor(private priceRepository: Repository<Price>) {}

    async save(priceData: PriceData): Promise<Price> {
        return await this.priceRepository.save(priceData);
    }

    async getById(priceId: number): Promise<Price | null> {
        return await this.priceRepository.findOne({
            where: { id: priceId },
        });
    }

    async gets(): Promise<Price[]> {
        return await this.priceRepository.find();
    }

    async delete(priceId: number): Promise<void> {
        await this.priceRepository.delete(priceId);
    }
}

export default PriceService;
