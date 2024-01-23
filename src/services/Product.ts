import { Repository } from "typeorm";
import { Product } from "../entity";
import { ProductData, Service } from "../types/type";

class ProductService implements Service<Product, ProductData> {
    constructor(private productRepository: Repository<Product>) {}

    async save(product: ProductData) {
        return await this.productRepository.save(product);
    }

    async getById(productId: number) {
        return await this.productRepository.findOne({
            where: { id: productId },
            relations: ["categories", "prices.size"],
        });
    }

    async gets(): Promise<Product[]> {
        return await this.productRepository.find({
            relations: {
                categories: true,
                prices: true,
            },
        });
    }

    async delete(productId: number) {
        await this.productRepository.delete(productId);
    }
}

export default ProductService;
