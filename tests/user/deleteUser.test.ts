import request from "supertest";
import createJwtMock from "mock-jwks";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { User } from "../../src/entity";

describe("[DELETE] /api/user", () => {
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
                password: "secret@password",
                role: UserRole.CUSTOMER,
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            // act
            const deleteUserResponse = await request(app)
                .delete(`/api/user`)
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(deleteUserResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: UserRole.CUSTOMER,
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            // act
            const deleteUserResponse = await request(app)
                .delete(`/api/user`)
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(
                (deleteUserResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should check persist user in database", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                role: UserRole.CUSTOMER,
                password: "secret@password",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            // act
            await request(app)
                .delete(`/api/user`)
                .set("Cookie", [`accessToken=${accessToken}`]);

            const usersRepository = connection.getRepository(User);
            const users = await usersRepository.find();

            // assert
            expect(users).toHaveLength(0);
        });

        it("should returns the deleted user id", async () => {
            // arrange
            const userData = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                role: UserRole.CUSTOMER,
                password: "secret@password",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: 1,
                role: UserRole.CUSTOMER,
            });

            // act
            const deleteUserResponse = await request(app)
                .delete(`/api/user`)
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(deleteUserResponse.body.user).toBeNull();
        });
    });

    describe("Missing some fields", () => {
        it("should returns 400 status code if user not found", async () => {
            // arrange
            const accessToken = jwt.token({
                userId: "2",
                role: UserRole.CUSTOMER,
            });

            // act
            const deleteUserResponse = await request(app)
                .delete(`/api/user`)
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(deleteUserResponse.statusCode).toBe(400);
        });
    });
});
