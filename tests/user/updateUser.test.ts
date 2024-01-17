import request from "supertest";
import { DataSource } from "typeorm";
import createJwtMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole, UserStatus } from "../../src/constants";
import { User } from "../../src/entity";

describe("[POST] /api/user/:userId", () => {
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
        it("should returns the 200 status code", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                role: UserRole.MANAGER,
                status: UserStatus.BANNED,
            };

            // act
            const updateUserResponse = await request(app)
                .post(`/api/user/1`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // assert
            expect(updateUserResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                role: UserRole.MANAGER,
                status: UserStatus.BANNED,
            };

            // act
            const updateUserResponse = await request(app)
                .post(`/api/user/1`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);
            // assert
            expect(
                (updateUserResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should returns the 400 status code if user not found", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                role: UserRole.MANAGER,
                status: UserStatus.BANNED,
            };

            // act
            const updateUserResponse = await request(app)
                .post(`/api/user/4`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // assert
            expect(updateUserResponse.statusCode).toBe(400);
        });

        it("should returns updated user data", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                role: UserRole.MANAGER,
                status: UserStatus.BANNED,
            };

            // act
            const updateUserResponse = await request(app)
                .post(`/api/user/1`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // assert
            expect(updateUserResponse.body.user.role).toBe(UserRole.MANAGER);
        });

        it("should updated user persist in database", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                role: UserRole.MANAGER,
                status: UserStatus.BANNED,
            };

            // act
            await request(app)
                .post(`/api/user/1`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // assert
            const users = await userRepository.find();
            expect(users[0].role).toBe(UserRole.MANAGER);
        });
    });

    describe("Missing some fields", () => {
        it("should returns the 400 status code if user role is missing", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                status: UserStatus.BANNED,
            };

            // act
            const updateUserResponse = await request(app)
                .post(`/api/user/1`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // assert
            expect(updateUserResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if user status is missing", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                role: UserRole.MANAGER,
            };

            // act
            const updateUserResponse = await request(app)
                .post(`/api/user/1`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // assert
            expect(updateUserResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if user id is invalid", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "hash-password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const adminToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });
            const updateUserData = {
                role: UserRole.MANAGER,
                status: UserStatus.BANNED,
            };

            // act
            const updateUserResponse = await request(app)
                .post(`/api/user/reww`)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(updateUserData);

            // assert
            expect(updateUserResponse.statusCode).toBe(400);
        });
    });
});
