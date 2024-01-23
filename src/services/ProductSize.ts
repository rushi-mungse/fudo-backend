import { Repository } from "typeorm";
import { Size } from "../entity";
import { ProductSizeData, ProductSizeServiceType } from "../types/type";

class ProductSizeService
    implements ProductSizeServiceType<Size, ProductSizeData>
{
    constructor(private sizeRepository: Repository<Size>) {}

    async save(productSizeData: ProductSizeData): Promise<Size> {
        return await this.sizeRepository.save(productSizeData);
    }

    async getById(productSizeId: number): Promise<Size | null> {
        return await this.sizeRepository.findOne({
            where: { id: productSizeId },
        });
    }

    async gets(): Promise<Size[]> {
        return await this.sizeRepository.find();
    }

    async delete(productSizeId: number): Promise<void> {
        await this.sizeRepository.delete(productSizeId);
    }

    async getByProductSizeName(sizeName: string): Promise<Size | null> {
        return await this.sizeRepository.findOne({ where: { size: sizeName } });
    }
}

export default ProductSizeService;
