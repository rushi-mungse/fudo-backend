import { Logger } from "winston";
import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CredentialService, UserService } from "../services";
import { UpdateUserFullNameRequest } from "../types";

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
}

export default UserController;
