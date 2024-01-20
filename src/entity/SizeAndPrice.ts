import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ProductSize } from "../constants";
import Product from "./Product";

@Entity({ name: "sizesAndPrices" })
class SizeAndPrice {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.sizeAndPrices)
    product: Product;

    @Column({ type: "enum", enum: ProductSize })
    size: string;

    @Column()
    price: number;

    @Column()
    currency: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default SizeAndPrice;
