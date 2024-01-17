import { checkSchema } from "express-validator";

export default checkSchema({
    fullName: {
        trim: true,
        notEmpty: true,
        errorMessage: "Full name is required!",
    },
});
