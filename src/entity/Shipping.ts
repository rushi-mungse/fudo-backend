import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./";

@Entity({ name: "shippings" })
class Shipping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    address: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    postalCode: string;

    @ManyToOne(() => User, (user) => user.shippings, { onDelete: "CASCADE" })
    user: User;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Shipping;
