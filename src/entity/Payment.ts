import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PaymentMethod } from "../constants";

@Entity({ name: "payments" })
class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: string;

    @Column({ type: "enum", enum: PaymentMethod })
    method: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Payment;
