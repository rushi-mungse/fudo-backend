import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

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

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Shipping;
