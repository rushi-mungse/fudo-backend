import { checkSchema } from "express-validator";

export default checkSchema({
    status: {
        trim: true,
        notEmpty: true,
        errorMessage: "User status is required!",
    },

    role: {
        trim: true,
        notEmpty: true,
        errorMessage: "User role required!",
    },
});
