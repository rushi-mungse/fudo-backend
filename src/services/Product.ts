import { Repository } from "typeorm";
import { Product } from "../entity";
import { GetQueryParams, ProductData, Service } from "../types/type";

class ProductService implements Service<Product, ProductData> {
    constructor(private productRepository: Repository<Product>) {}

    async save(product: ProductData) {
        return await this.productRepository.save(product);
    }

    async getById(productId: number) {
        return await this.productRepository.findOne({
            where: { id: productId },
            relations: {
                categories: true,
                prices: { size: true },
            },
        });
    }

    async get(queryParams: GetQueryParams): Promise<[Product[], number]> {
        const queryBuilder =
            this.productRepository.createQueryBuilder("product");

        const result = await queryBuilder
            .skip((queryParams.currentPage - 1) * queryParams.perPage)
            .take(queryParams.perPage)
            .leftJoinAndSelect("product.categories", "categories")
            .leftJoinAndSelect("product.prices", "prices")
            .leftJoinAndSelect("prices.size", "size")
            .getManyAndCount();

        return result;
    }

    async gets(): Promise<Product[]> {
        return await this.productRepository.find({
            relations: {
                categories: true,
                prices: { size: true },
            },
        });
    }

    async delete(productId: number) {
        await this.productRepository.delete(productId);
    }
}

export default ProductService;
