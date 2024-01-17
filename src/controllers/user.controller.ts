import { Logger } from "winston";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CredentialService, UserService } from "../services";
import {
    AuthRequest,
    ChangePasswordRequest,
    UpdateUserFullNameRequest,
} from "../types";

class UserController {
    constructor(
        private logger: Logger,
        private userService: UserService,
        private credentialService: CredentialService,
    ) {}

    async updateUserFullName(
        req: UpdateUserFullNameRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;
        const { fullName } = req.body;

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            user.fullName = fullName;
            await this.userService.saveUser(user);

            return res.json({
                message: "Updated user full name successfully.",
                user: { ...user, password: null },
            });
        } catch (error) {
            return next(error);
        }
    }

    async changePassword(
        req: ChangePasswordRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const userId = req.auth.userId;
        const { newPassword, oldPassword } = req.body;

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            const hashPassword = user.password;
            const isMatch = await this.credentialService.hashCompare(
                oldPassword,
                hashPassword,
            );
            if (!isMatch)
                return next(
                    createHttpError(400, "Old password does not match!"),
                );
            const newHashPassword =
                await this.credentialService.hashData(newPassword);

            user.password = newHashPassword;
            await this.userService.saveUser(user);

            return res.json({ message: "User password changed successfully" });
        } catch (error) {
            return next(error);
        }
    }

    async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.auth.userId;

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            await this.userService.deleteUserById(Number(userId));

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            return res.json({
                user: null,
                message: "User deleted successfully",
            });
        } catch (error) {
            return next(error);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        if (isNaN(Number(userId)))
            return next(createHttpError(400, "Invalid param id!"));

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));
            return res.json({ user: { ...user, password: null } });
        } catch (error) {
            return next(error);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAllUsers();
            return res.json({ users });
        } catch (error) {
            return next(error);
        }
    }

    async updateUserProfilePicture(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        const userId = req.auth.userId;
        const file = req.file;
        if (!file) return next(createHttpError(400, "User picture not found!"));

        try {
            const user = await this.userService.findUserById(Number(userId));
            if (!user) return next(createHttpError(400, "User not found!"));

            user.avatar = file.path;
            await this.userService.saveUser(user);
            return res.json({
                user,
                message: "User profile picture updated successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default UserController;
