import { checkSchema } from "express-validator";

export default checkSchema({
    name: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product category is required!",
    },
});
