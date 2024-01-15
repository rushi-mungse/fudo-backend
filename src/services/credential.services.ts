import bcrypt from "bcrypt";
import crypto from "crypto";
import createHttpError from "http-errors";
import { HASH_SECRET } from "../config";

export default class CredentialService {
    async hashData(data: string) {
        const SALT = 10;
        return await bcrypt.hash(data, SALT);
    }

    async hashCompare(data: string, hashData: string) {
        return await bcrypt.compare(data, hashData);
    }

    hashDataWithSecret(data: string) {
        if (!HASH_SECRET)
            throw createHttpError(500, "Hash secret is not found!");
        return crypto
            .createHmac("sha256", HASH_SECRET)
            .update(data)
            .digest("hex");
    }

    generateOtp() {
        return crypto.randomInt(1000, 9999);
    }
}
