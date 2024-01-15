import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

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
