import { Repository } from "typeorm";
import { User } from "../entity";
import { UserData } from "../types";
import createHttpError from "http-errors";

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

    async updateUserPassword(userId: number, password: string) {
        const user = await this.findUserById(userId);
        if (!user) throw createHttpError(400, "User not found!");
        user.password = password;
        await this.saveUser(user);
    }

    async deleteUserById(userId: number) {
        await this.userRepository.delete(userId);
    }

    async getAllUsers() {
        return await this.userRepository.find();
    }
}

export default UserService;
