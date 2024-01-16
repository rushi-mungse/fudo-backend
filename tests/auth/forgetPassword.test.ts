import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";

describe("[POST] /api/auth/forget-password", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection?.destroy();
    });

    const sendOtpData = {
        fullName: "Jon Doe",
        email: "jon.doe@gmail.com",
        password: "fudo_secret",
        confirmPassword: "fudo_secret",
    };

    const forgetPasswordData = {
        email: "jon.doe@gmail.com",
    };

    describe("Given all fields", () => {
        it("should returns the 200 status code", async () => {
            // arrange
            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(sendOtpData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            // act
            const forgetPasswordResponse = await request(app)
                .post("/api/auth/forget-password")
                .send(forgetPasswordData);

            // assert
            expect(forgetPasswordResponse.statusCode).toBe(200);
        });

        it("should returns json response", async () => {
            // arrange
            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(sendOtpData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            // act
            const forgetPasswordResponse = await request(app)
                .post("/api/auth/forget-password")
                .send(forgetPasswordData);

            //assert
            expect(
                (forgetPasswordResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should return 400 status code if email is not registered", async () => {
            //act
            const forgetPasswordResponse = await request(app)
                .post("/api/auth/forget-password")
                .send(forgetPasswordData);

            // act
            expect(forgetPasswordResponse.statusCode).toBe(400);
        });

        it("should return hashOtp", async () => {
            // arragne
            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(sendOtpData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            // act
            const forgetPasswordResponse = await request(app)
                .post("/api/auth/forget-password")
                .send(forgetPasswordData);

            // assert
            expect(forgetPasswordResponse.body).toHaveProperty("otpInfo");
        });
    });

    describe("Some fields are missing", () => {
        it("should return 400 status code if email is missing", async () => {
            // arrange
            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(sendOtpData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            // act
            const forgetPasswordResponse = await request(app)
                .post("/api/auth/forget-password")
                .send();

            // assert
            expect(forgetPasswordResponse.statusCode).toBe(400);
        });
    });
});
