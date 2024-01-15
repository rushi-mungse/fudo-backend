export const UserRole = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    MANAGER: "manager",
} as const;

export const UserStatus = {
    ACTIVE: "active",
    BANNED: "banned",
    VALID: "valid",
} as const;

export const ProductSize = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
} as const;

export const PaymentMethod = {
    UPI: "upi",
    NET_BANKING: "net banking",
} as const;

export const OrderStatus = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELED: "Canceled",
};
