import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "./User";
import OrderItem from "./OrderItem";
import { OrderStatus } from "../constants";
import Shipping from "./Shipping";
import Payment from "./Payment";

@Entity({ name: "orders" })
class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.id)
    orderItems: OrderItem[];

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: string;

    @OneToOne(() => Shipping)
    shipping: Shipping;

    @OneToOne(() => Payment, (payment) => payment.id)
    payment: Payment;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Order;
