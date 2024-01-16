import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { getTokens } from "../utils";
import { UserRole } from "../../src/constants";
import { User } from "../../src/entity";

describe("[GET] auth/self", () => {
    let connection: DataSource;
    let jwt: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwt = createJWKSMock("http://localhost:5500");
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

    afterAll(async () => {
        await connection.destroy();
    });

    describe("all fields are given", () => {
        it("should return 200 status code if all ok", async () => {
            // arrange
            const sendOtpData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(sendOtpData);

            const accessToken = jwt.token({
                userId: 1,
                role: UserRole.CUSTOMER,
            });

            // act
            const selfResponse = await request(app)
                .get("/api/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(selfResponse.statusCode).toBe(200);
        });

        it("should return json data", async () => {
            // arrange
            const sendOtpData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(sendOtpData);

            const accessToken = jwt.token({
                userId: 1,
                role: UserRole.CUSTOMER,
            });

            // act
            const selfResponse = await request(app)
                .get("/api/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(
                (selfResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should return 401 status code if user is unauthorized", async () => {
            // arrange
            const sendOtpData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(sendOtpData);

            // act
            const selfResponse = await request(app)
                .get("/api/auth/self")
                .set("Cookie", [`accessToken=does-not-pass-access-token`]);

            // assert
            expect(selfResponse.statusCode).toBe(401);
        });

        it("should return user data with user data", async () => {
            // arrange
            const sendOtpData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(sendOtpData);

            const accessToken = jwt.token({
                userId: 1,
                role: UserRole.CUSTOMER,
            });

            // act
            const selfResponse = await request(app)
                .get("/api/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(selfResponse.body).toHaveProperty("user");
        });

        it("should return 400 status code if user not found", async () => {
            // arrage
            const accessToken = jwt.token({
                userId: 3,
                role: UserRole.CUSTOMER,
            });
            // act
            const selfResponse = await request(app)
                .get("/api/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(selfResponse.statusCode).toBe(400);
        });
    });
});
