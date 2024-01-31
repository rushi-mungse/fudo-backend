import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Category, Price } from "./";

@Entity({ name: "products" })
class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column("boolean")
    availability: boolean;

    @Column("text")
    imageUrl: string;

    @Column()
    preparationTime: number;

    @Column()
    discount: number;

    @Column("simple-array")
    ingredients: string[];

    @ManyToMany(() => Category, (category) => category.products)
    categories: Category[];

    @OneToMany(() => Price, (price) => price.product)
    prices: Price[];

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Product;
