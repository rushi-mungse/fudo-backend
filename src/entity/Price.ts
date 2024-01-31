import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Size, Product } from "./";

@Entity({ name: "prices" })
class Price {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.prices, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    product: Product;

    @ManyToOne(() => Size, (size) => size.prices, { onDelete: "CASCADE" })
    @JoinColumn()
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
