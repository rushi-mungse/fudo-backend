import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Product from "./Product";
import { Size } from "./";

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
