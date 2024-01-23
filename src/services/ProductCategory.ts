import { Repository } from "typeorm";
import { Category } from "../entity";
import { CategoryData, CategoryServiceType } from "../types/type";

class CategoryService implements CategoryServiceType<Category, CategoryData> {
    constructor(private categoryRepository: Repository<Category>) {}

    async save(category: CategoryData): Promise<Category> {
        return await this.categoryRepository.save(category);
    }

    async gets(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async getById(categoryId: number): Promise<Category | null> {
        return await this.categoryRepository.findOne({
            where: { id: categoryId },
        });
    }

    async delete(categoryId: number): Promise<void> {
        await this.categoryRepository.delete(categoryId);
    }

    async getByCategoryName(categoryName: string): Promise<Category | null> {
        return await this.categoryRepository.findOne({
            where: { name: categoryName },
        });
    }
}

export default CategoryService;
