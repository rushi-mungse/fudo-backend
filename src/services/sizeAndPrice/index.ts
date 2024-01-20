import { Repository } from "typeorm";
import { SizeAndPrice } from "../../entity";
import { SizeAndPriceDataType } from "../../types";

class SizeAndPriceService {
    constructor(private sizeAndPriceRepository: Repository<SizeAndPrice>) {}

    async saveSizeAndPrice(sizeAndPrice: SizeAndPriceDataType) {
        return await this.sizeAndPriceRepository.save(sizeAndPrice);
    }
}

export default SizeAndPriceService;
