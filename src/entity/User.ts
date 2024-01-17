import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserRole, UserStatus } from "../constants";
import { Shipping } from "./";

@Entity({ name: "users" })
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    fullName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
    role: string;

    @Column({ nullable: true, default: null })
    phoneNumber: string;

    @Column({ nullable: true, default: null })
    countryCode: string;

    @Column("text", { nullable: true, default: null })
    avatar: string;

    @Column({ type: "enum", enum: UserStatus, default: UserStatus.VALID })
    status: string;

    @OneToMany(() => Shipping, (shipping) => shipping.user, {
        cascade: true,
    })
    shippings: Shipping[];

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

export default User;
