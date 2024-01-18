import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "./User";

@Entity({ name: "shippings" })
class Shipping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    address: string;

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
