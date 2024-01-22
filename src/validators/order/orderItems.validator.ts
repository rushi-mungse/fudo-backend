import { checkSchema } from "express-validator";
export default checkSchema({
    cart: {
        trim: true,
        notEmpty: true,
        errorMessage: "Items cart is required!",
    },

    shippingId: {
        trim: true,
        notEmpty: true,
        errorMessage: "Shipping address is required!",
    },
});
