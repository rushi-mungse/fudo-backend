import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
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
    @JoinColumn()
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.id)
    @JoinColumn()
    orderItems: OrderItem[];

    @Column({ type: "enum", enum: OrderStatus })
    status: string;

    @OneToOne(() => Shipping)
    @JoinColumn()
    shipping: Shipping;

    @OneToOne(() => Payment)
    @JoinColumn()
    payment: Payment;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default Order;
