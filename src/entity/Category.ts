import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Product from "./Product";

@Entity({ name: "categories" })
class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Product, (product) => product.categories)
    @JoinTable()
    products: Product[];

    @Column()
    name: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Category;
