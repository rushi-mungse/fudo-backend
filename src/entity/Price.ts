import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Size, Product } from "./";

@Entity({ name: "prices" })
class Price {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.prices)
    product: Product;

    @ManyToOne(() => Size, (size) => size.prices)
    size: Size;

    @Column()
    price: number;

    @Column()
    currency: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Price;
