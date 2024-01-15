import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ProductSize } from "../constants";

@Entity({ name: "sizesAndPrices" })
class SizeAndPrice {
    @PrimaryGeneratedColumn()
    id: number;

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
