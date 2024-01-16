import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { TokenService } from "../../src/services";
import { Token, User } from "../../src/entity";

describe("[GET] auth/logout", () => {
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
            const user = {
                fullName: "Jon Doe",
                email: "foo@gmail.com",
                password: "foo_secret",
            };
            const userRepository = connection.getRepository(User);
            const dbUser = await userRepository.save(user);

            const tokenRepository = connection.getRepository(Token);
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const expiresAt = new Date(Date.now() + MS_IN_YEAR);
            const token = await tokenRepository.save({
                user: dbUser,
                expiresAt,
            });

            const accessToken = jwt.token({
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
            });

            const payload = {
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
                tokenId: String(token.id),
            };
            const tokenService = new TokenService(tokenRepository);
            const refreshToken = tokenService.signRefreshToken(payload);

            // act
            const logoutResponse = await request(app)
                .get("/api/auth/logout")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            expect(logoutResponse.statusCode).toBe(200);
        });

        it("should return json data", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "foo@gmail.com",
                password: "foo_secret",
            };
            const userRepository = connection.getRepository(User);
            const dbUser = await userRepository.save(user);

            const tokenRepository = connection.getRepository(Token);
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const expiresAt = new Date(Date.now() + MS_IN_YEAR);
            const token = await tokenRepository.save({
                user: dbUser,
                expiresAt,
            });

            const accessToken = jwt.token({
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
            });

            const payload = {
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
                tokenId: String(token.id),
            };
            const tokenService = new TokenService(tokenRepository);
            const refreshToken = tokenService.signRefreshToken(payload);

            // act
            const logoutResponse = await request(app)
                .get("/api/auth/logout")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            expect(
                (logoutResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should return 401 status code if user is unauthorized", async () => {
            // act
            const logoutResponse = await request(app).get("/api/auth/self");

            // assert
            expect(logoutResponse.statusCode).toBe(401);
        });

        it("should return user data null", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "foo@gmail.com",
                password: "foo_secret",
            };
            const userRepository = connection.getRepository(User);
            const dbUser = await userRepository.save(user);

            const tokenRepository = connection.getRepository(Token);
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const expiresAt = new Date(Date.now() + MS_IN_YEAR);
            const token = await tokenRepository.save({
                user: dbUser,
                expiresAt,
            });

            const accessToken = jwt.token({
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
            });

            const payload = {
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
                tokenId: String(token.id),
            };
            const tokenService = new TokenService(tokenRepository);
            const refreshToken = tokenService.signRefreshToken(payload);

            // act
            const logoutResponse = await request(app)
                .get("/api/auth/logout")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            expect(logoutResponse.body.user).toBeNull();
        });

        it("should persist token in database", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "foo@gmail.com",
                password: "foo_secret",
            };
            const userRepository = connection.getRepository(User);
            const dbUser = await userRepository.save(user);

            const tokenRepository = connection.getRepository(Token);
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const expiresAt = new Date(Date.now() + MS_IN_YEAR);
            const token = await tokenRepository.save({
                user: dbUser,
                expiresAt,
            });

            const accessToken = jwt.token({
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
            });

            const payload = {
                userId: String(dbUser.id),
                role: UserRole.CUSTOMER,
                tokenId: String(token.id),
            };
            const tokenService = new TokenService(tokenRepository);
            const refreshToken = tokenService.signRefreshToken(payload);

            // act
            await request(app)
                .get("/api/auth/logout")
                .set("Cookie", [
                    `accessToken=${accessToken}`,
                    `refreshToken=${refreshToken}`,
                ]);

            // assert
            const tokens = await tokenRepository.find();
            expect(tokens).toHaveLength(0);
        });
    });
});
