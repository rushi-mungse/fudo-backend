import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ProductSize } from "../constants";
import { Price } from "./";

@Entity({ name: "sizes" })
class Size {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Price, (price) => price.size)
    prices: Price[];

    @Column({ type: "enum", enum: ProductSize, nullable: true })
    size: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Size;
