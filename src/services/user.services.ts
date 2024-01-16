import { Repository } from "typeorm";
import { User } from "../entity";
import { UserData } from "../types";

class UserService {
    constructor(private userRepository: Repository<User>) {}

    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }

    async saveUser(userData: UserData) {
        return await this.userRepository.save(userData);
    }

    async findUserById(userId: number) {
        return await this.userRepository.findOne({ where: { id: userId } });
    }
}

export default UserService;
