import { Repository } from "typeorm";
import { Price } from "../../entity";
import { PriceData } from "../../types";

class PriceService {
    constructor(private priceRepository: Repository<Price>) {}

    async savePrice(price: PriceData) {
        return await this.priceRepository.save(price);
    }
}

export default PriceService;
