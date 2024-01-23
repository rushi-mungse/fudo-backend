import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PaymentMethod } from "../constants";
import { Order } from "./";

@Entity({ name: "payments" })
class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Order, (order) => order.payment)
    order: Order;

    @Column()
    amount: number;

    @Column({ type: "enum", enum: PaymentMethod })
    method: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Payment;
