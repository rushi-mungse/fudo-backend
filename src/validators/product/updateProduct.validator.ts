import { checkSchema } from "express-validator";
export default checkSchema({
    name: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product name is required!",
    },

    description: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product description is required!",
    },

    discount: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product discount is required!",
    },

    availability: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product availability is required!",
    },

    preparationTime: {
        trim: true,
        notEmpty: true,
        errorMessage: "Preparation time is required!",
    },

    category: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product category is required!",
    },

    ingredients: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product ingredients is required!",
    },
});
