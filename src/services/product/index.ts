import { Repository } from "typeorm";
import { Product } from "../../entity";
import { ProductData } from "../../types";

class ProductService {
    constructor(private productRepository: Repository<Product>) {}

    async saveProduct(product: ProductData) {
        return await this.productRepository.save(product);
    }

    async getProducts() {
        return await this.productRepository.find({
            relations: ["categories", "prices"],
        });
    }

    async deleteProduct(productId: number) {
        await this.productRepository.delete(productId);
    }

    async findProductById(productId: number) {
        return await this.productRepository.findOne({
            where: { id: productId },
            relations: ["categories", "prices.size"],
        });
    }
}

export default ProductService;
