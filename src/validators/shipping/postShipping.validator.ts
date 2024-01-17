import { checkSchema } from "express-validator";

export default checkSchema({
    address: {
        trim: true,
        notEmpty: true,
        errorMessage: "Address is required!",
    },

    city: {
        trim: true,
        notEmpty: true,
        errorMessage: "City is required!",
    },

    postalCode: {
        trim: true,
        notEmpty: true,
        errorMessage: "Postal code is required!",
        isLength: {
            options: {
                min: 6,
                max: 6,
            },
            errorMessage: "Postal code length should be 6 digit!",
        },
    },
});
