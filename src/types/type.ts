import { JwtPayload } from "jsonwebtoken";
import { Request } from "express-jwt";
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

export type Maybe<T> = T | null | undefined;

export type TJwtPayload = JwtPayload & {
    userId: string;
    role: string;
    tokenId?: string;
};

export interface UserData {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    cuntryCode?: string;
    avatar?: string;
    shippings?: Shipping[];
}

export interface CategoryData {
    name: string;
}

export interface OrderData {
    user: User;
    shipping: Shipping;
    payment: Payment;
    orderItems: OrderItem[];
    status?: string;
}

export interface CartData {
    [key: string]: ItemData;
}

export interface ItemData {
    quantity: number;
    size: string;
}

export interface OrderItemData {
    quantity: number;
    product: Product;
}

export interface PaymentData {
    amount: number;
    method: string;
}

export interface PriceData {
    size: Size;
    price: number;
    currency: string;
    product?: Product;
}

export interface ProductSizeData {
    size: string;
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

export interface ShippingData {
    address: string;
    country: string;
    city: string;
    postalCode: string;
    user: User;
}

export interface TokenData {
    user: User;
    expiresAt: Date;
}

export interface SizeAndPriceData {
    [key: string]: string;
}

export interface CookieData {
    accessToken: string;
    refreshToken: string;
}

export interface Service<Entity, Data> {
    getById(id: number): Promise<Entity | null>;
    save(data: Data): Promise<Entity>;
    gets(): Promise<Entity[]>;
    delete(id: number): Promise<void>;
}

export interface UserServiceType<Entity, Data> extends Service<Entity, Data> {
    getByEmail(email: string): Promise<User | null>;
}

export interface CategoryServiceType<Entity, Data>
    extends Service<Entity, Data> {
    getByCategoryName(categoryName: string): Promise<Category | null>;
}

export interface OrderServiceType<Entity, Data> extends Service<Entity, Data> {
    getsByUserId(userId: number): Promise<Entity[]>;
}

export interface ProductSizeServiceType<Entity, Data>
    extends Service<Entity, Data> {
    getByProductSizeName(productSizeName: string): Promise<Entity | null>;
}

export interface ShippingServiceType<Entity, Data>
    extends Service<Entity, Data> {
    getsByUserId(userId: number): Promise<Entity[]>;
    getsShippingsByUserId(
        userId: number,
        shippingId: number,
    ): Promise<Entity | null>;
}

export interface TokenServiceType<Entity, Data> extends Service<Entity, Data> {
    signAccessToken(payload: TJwtPayload): string;
    signRefreshToken(payload: TJwtPayload): string;
    verifyRefreshToken(token: string): JwtPayload | string;
}

export interface PaymentServiceType<Entity, Data>
    extends Service<Entity, Data> {
    getPaymentByUserId(userId: number): Promise<Payment | null>;
}

export interface CredentialServiceType {
    hashData(data: string): Promise<string>;
    hashCompare(data: string, hashData: string): Promise<boolean>;
    hashDataWithSecret(data: string): string;
    getOtp(): number;
}

export interface AuthRequest<Body = null> extends Request {
    auth: TJwtPayload;
    body: Body;
}

export interface SendOtpRequestBody {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface VerifyOtpRequestBody {
    fullName: string;
    email: string;
    otp: string;
    hashOtp: string;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface ForgetPasswordRequestBody {
    email: string;
}

export interface SetPasswordRequestBody {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
    hashOtp: string;
}

export interface UpdateFullNameRequestBody {
    fullName: string;
}

export interface ChangePasswordRequestBody {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateUserByAdminRequestBody {
    status: string;
    role: string;
}

export interface CreateCategoryRequestBody {
    name: string;
}

export interface OrderItemsRequestBody {
    cart: string;
    shippingId: number;
}

export interface AddProductSizeRequestBody {
    size: string;
}

export interface ProductRequestBody {
    name: string;
    description: string;
    discount: string;
    availability: string;
    ingredients: string;
    preparationTime: string;
    sizeAndPrices: string;
    categoryName: string;
    currency: string;
}
