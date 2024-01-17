import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

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
