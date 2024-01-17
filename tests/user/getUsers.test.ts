import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { TokenService } from "../../src/services";
import { Token, User } from "../../src/entity";

describe("[GET] user/get", () => {
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
            const tokenRepository = connection.getRepository(Token);
            const userRespository = connection.getRepository(User);

            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: UserRole.CUSTOMER,
            };

            await userRespository.save(userData);

            const accessToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });

            const refreshToken = new TokenService(
                tokenRepository,
            ).signRefreshToken({
                userId: "2",
                role: UserRole.ADMIN,
                tokenId: "1",
            });

            // act
            const getUsersResponse = await request(app)
                .get("/api/user")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            expect(getUsersResponse.statusCode).toBe(200);
        });

        it("should return json data", async () => {
            // arrange
            const tokenRepository = connection.getRepository(Token);
            const userRespository = connection.getRepository(User);

            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: UserRole.CUSTOMER,
            };

            await userRespository.save(userData);

            const accessToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });

            const refreshToken = new TokenService(
                tokenRepository,
            ).signRefreshToken({
                userId: "2",
                role: UserRole.ADMIN,
                tokenId: "1",
            });

            // act
            const getUsersResponse = await request(app)
                .get("/api/user")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            expect(
                (getUsersResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should return 403 status code if user not admin", async () => {
            // arrange
            const tokenRepository = connection.getRepository(Token);
            const userRespository = connection.getRepository(User);

            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: UserRole.CUSTOMER,
            };

            await userRespository.save(userData);

            const accessToken = jwt.token({
                userId: "2",
                role: UserRole.CUSTOMER,
            });

            const refreshToken = new TokenService(
                tokenRepository,
            ).signRefreshToken({
                userId: "2",
                role: UserRole.CUSTOMER,
                tokenId: "1",
            });

            // act
            const getUsersResponse = await request(app)
                .get("/api/user")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            expect(getUsersResponse.statusCode).toBe(403);
        });

        it("should return json users data", async () => {
            // arrange
            const tokenRepository = connection.getRepository(Token);
            const userRespository = connection.getRepository(User);

            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: UserRole.CUSTOMER,
            };

            await userRespository.save(userData);

            const accessToken = jwt.token({
                userId: 1,
                role: UserRole.ADMIN,
            });

            const refreshToken = new TokenService(
                tokenRepository,
            ).signRefreshToken({
                userId: "1",
                role: UserRole.ADMIN,
                tokenId: "1",
            });

            // act
            const getUsersResponse = await request(app)
                .get("/api/user")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            expect(getUsersResponse.body.users).toHaveLength(1);
        });
    });
});
