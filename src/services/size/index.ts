import { Repository } from "typeorm";
import { Size } from "../../entity";

class SizeService {
    constructor(private sizeRepository: Repository<Size>) {}

    async findSizeBySizeName(sizeName: string): Promise<Size | null> {
        return await this.sizeRepository.findOne({ where: { size: sizeName } });
    }

    async saveSize(size: string): Promise<Size> {
        return await this.sizeRepository.save({ size });
    }
}

export default SizeService;
