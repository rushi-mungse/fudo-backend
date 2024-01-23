import { Repository } from "typeorm";
import { User } from "../entity";
import { UserServiceType, UserData } from "../types/type";

class UserService implements UserServiceType<User, UserData> {
    constructor(private userRepository: Repository<User>) {}

    async getById(userId: number): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id: userId },
            relations: { shippings: true },
        });
    }

    async save(userData: UserData): Promise<User> {
        return await this.userRepository.save(userData);
    }

    async gets(): Promise<User[]> {
        return await this.userRepository.find({
            relations: { shippings: true },
        });
    }

    async delete(userId: number): Promise<void> {
        await this.userRepository.delete(userId);
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { email },
            relations: { shippings: true },
        });
    }
}

export default UserService;
