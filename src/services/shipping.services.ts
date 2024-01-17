import { Repository } from "typeorm";
import { Shipping } from "../entity";
import { ShippingData } from "../types";

class ShippingService {
    constructor(private shippingRepository: Repository<Shipping>) {}

    async saveShipping(shipping: ShippingData) {
        return await this.shippingRepository.save(shipping);
    }
}

export default ShippingService;
