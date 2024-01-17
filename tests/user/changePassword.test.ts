import request from "supertest";
import { DataSource } from "typeorm";
import createJwtMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { User } from "../../src/entity";

describe("[POST] /api/user/change-password", () => {
    let connection: DataSource;
    let jwt: ReturnType<typeof createJwtMock>;

    beforeAll(async () => {
        jwt = createJwtMock("http://localhost:5500");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwt.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwt.stop();
    });

    describe("Given all fields", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                confirmPassword: "secret@password",
            };

            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(userData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });
            // act
            const changePasswordResponse = await request(app)
                .post(`/api/user/change-password`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    oldPassword: "secret@password",
                    newPassword: "1234567890",
                });
            // assert
            expect(changePasswordResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                confirmPassword: "secret@password",
            };

            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(userData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            // act
            const changePasswordResponse = await request(app)
                .post(`/api/user/change-password`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    oldPassword: "secret@password",
                    newPassword: "1234567890",
                });
            // assert
            expect(
                (changePasswordResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should returns the 400 status code if oldPassword mismatch", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                confirmPassword: "secret@password",
            };

            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(userData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });
            // act
            const changePasswordResponse = await request(app)
                .post(`/api/user/change-password`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    oldPassword: "scret@password",
                    newPassword: "1234567890",
                });
            // assert
            expect(changePasswordResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if user not found", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                confirmPassword: "secret@password",
            };

            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(userData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            const accessToken = jwt.token({
                userId: "2",
                role: UserRole.CUSTOMER,
            });
            // act
            const changePasswordResponse = await request(app)
                .post(`/api/user/change-password`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    oldPassword: "secret@password",
                    newPassword: "1234567890",
                });

            //assert
            expect(changePasswordResponse.statusCode).toBe(400);
        });

        it("should user changed password persist in database", async () => {
            //arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                confirmPassword: "secret@password",
            };

            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(userData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const oldHashPassword = users[0].password;

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            // act
            await request(app)
                .post(`/api/user/change-password`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    oldPassword: "secret@password",
                    newPassword: "1234567890",
                });

            // assert
            const newUsers = await userRepository.find();
            expect(newUsers[0].password).not.toEqual(oldHashPassword);
        });
    });

    describe("Missing some fields", () => {
        it("should return 400 status code if oldPassword missing", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                confirmPassword: "secret@password",
            };

            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(userData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            // act
            const changePasswordResponse = await request(app)
                .post(`/api/user/change-password`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    newPassword: "1234567890",
                });

            // assert
            expect(changePasswordResponse.statusCode).toBe(400);
        });

        it("should return 400 status code if newPassowrd missing", async () => {
            // arrage
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                confirmPassword: "secret@password",
            };

            const sendOtpResponse = await request(app)
                .post("/api/auth/register/send-otp")
                .send(userData);

            await request(app)
                .post("/api/auth/register/verify-otp")
                .send({
                    ...sendOtpResponse.body.otpInfo,
                    otp: sendOtpResponse.body.otp,
                });

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            // act
            const changePasswordResponse = await request(app)
                .post(`/api/user/change-password`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    oldPassword: "1234567890",
                });
            // assert
            expect(changePasswordResponse.statusCode).toBe(400);
        });
    });
});
