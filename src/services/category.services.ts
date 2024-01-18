import { Repository } from "typeorm";
import { Category } from "../entity";
import { CategoryData } from "../types";

class CategoryService {
    constructor(private categoryRepository: Repository<Category>) {}

    async saveCategory(category: CategoryData): Promise<Category> {
        return await this.categoryRepository.save(category);
    }

    async getCategories(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async findCategoryById(categoryId: number): Promise<Category | null> {
        return await this.categoryRepository.findOne({
            where: { id: categoryId },
        });
    }

    async deleteCategory(categoryId: number): Promise<void> {
        await this.categoryRepository.delete(categoryId);
    }

    async findCategoryByName(categoryName: string): Promise<Category | null> {
        return await this.categoryRepository.findOne({
            where: { name: categoryName },
        });
    }
}

export default CategoryService;
