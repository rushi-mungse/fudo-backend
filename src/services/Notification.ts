class NotificationService {
    constructor() {}

    sendOtpByEmail(email: string, otp: string, msg = "") {
        return { ok: true, msg: `Otp sent to ${email} successfully` };
    }
}

export default NotificationService;
