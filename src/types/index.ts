import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
    Category,
    OrderItem,
    Payment,
    Price,
    Product,
    Shipping,
    Size,
    User,
} from "../entity";

export interface AuthRequest extends Request {
    auth: JWTPayload;
}

export interface SendOtpData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SendOtpRequest extends Request {
    body: SendOtpData;
}

export interface VerifyOtpData {
    email: string;
    fullName: string;
    hashOtp: string;
    otp: string;
}

export interface VerifyOtpRequest extends Request {
    body: VerifyOtpData;
}

export interface UserData {
    fullName: string;
    email: string;
    password: string;
    role?: string;
}

export type JWTPayload = JwtPayload & {
    userId: string;
    role: string;
    tokenId?: string;
};

export interface CookieType {
    accessToken: string;
    refreshToken: string;
}

export interface LoginData {
    email: string;
    password: string;
}
export interface LoginRequest extends Request {
    body: LoginData;
}

export interface ForgetPasswordRequest extends Request {
    body: {
        email: string;
    };
}

export interface SetPasswordRequest extends Request {
    body: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
        hashOtp: string;
        otp: string;
    };
}

export interface UpdateUserFullNameRequest extends Request {
    auth: JWTPayload;
    body: {
        fullName: string;
    };
}

export interface ChangePasswordRequest extends Request {
    auth: JWTPayload;
    body: {
        oldPassword: string;
        newPassword: string;
    };
}

export interface UpdateUserData {
    role: string;
    status: string;
}

export interface UpdateUserRequest extends Request {
    body: UpdateUserData;
}

export interface ShippingData {
    address: string;
    city: string;
    postalCode: string;
    user?: User;
}

export interface PostShippingRequest extends Request {
    auth: JWTPayload;
    body: ShippingData;
}

export interface CategoryData {
    name: string;
}
export interface CreateCategoryRequest extends Request {
    body: CategoryData;
}

export interface CreateProductRequest extends Request {
    auth: JWTPayload;
    body: {
        name: string;
        description: string;
        availability: boolean;
        preparationTime: number;
        discount: number;
        ingredients: string;
        category: string;
        sizeAndPrices: string;
        currency: string;
    };
}

export interface ProductData {
    name: string;
    description: string;
    availability: boolean;
    imageUrl: string;
    preparationTime: number;
    discount: number;
    ingredients: string[];
    categories: Category[];
    prices: Price[];
}

export interface OrderItemData {
    product: Product;
    quantity: number;
}

export interface ItemData {
    quantity: number;
    size: string;
}

export interface CartData {
    [key: string]: ItemData;
}

export interface OrderItemRequest extends Request {
    auth: JWTPayload;
    body: {
        cart: string;
        shippingId: string;
    };
}

export interface OrderData {
    user: User;
    orderItems: OrderItem[];
    shipping: Shipping;
    payment: Payment;
}

export interface PaymentData {
    amount: number;
    method: string;
}

export interface SizeAndPriceData {
    [key: string]: string;
}

export interface PriceData {
    price: number;
    size: Size;
    currency: string;
}

export interface AddProductSizeRequest extends Request {
    auth: JWTPayload;
    body: {
        size: string;
    };
}
