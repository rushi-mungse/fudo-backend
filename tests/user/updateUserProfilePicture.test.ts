import path from "path";
import request from "supertest";
import createJwtMock from "mock-jwks";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { User } from "../../src/entity";

const TIMEOUT_INTERVAL = 10000;

describe("[POST] /api/user/update-profile-picture", () => {
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
        it(
            "should returns the 200 status code",
            async () => {
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
                const testPathfile = path.resolve(
                    __dirname,
                    "../utils/img/test.avif",
                );

                // act
                const updateProfilePictureResponse = await request(app)
                    .post(`/api/user/update-profile-picture`)
                    .set("Cookie", [`accessToken=${accessToken}`])
                    .attach("avatar", testPathfile);

                // assert
                expect(updateProfilePictureResponse.statusCode).toBe(200);
            },
            TIMEOUT_INTERVAL,
        );

        it(
            "should returns the json data",
            async () => {
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
                const testPathfile = path.resolve(
                    __dirname,
                    "../utils/img/test.avif",
                );

                // act
                const updateProfilePictureResponse = await request(app)
                    .post(`/api/user/update-profile-picture`)
                    .set("Cookie", [`accessToken=${accessToken}`])
                    .attach("avatar", testPathfile);

                // assert
                expect(
                    (
                        updateProfilePictureResponse.headers as Record<
                            string,
                            string
                        >
                    )["content-type"],
                ).toEqual(expect.stringContaining("json"));
            },
            TIMEOUT_INTERVAL,
        );

        it("should returns the 400 status code if user not found", async () => {
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
                userId: "2",
                role: UserRole.CUSTOMER,
            });

            const testPathfile = path.resolve(
                __dirname,
                "../utils/img/test.avif",
            );

            // act
            const updateProfilePictureResponse = await request(app)
                .post(`/api/user/update-profile-picture`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .attach("avatar", testPathfile);

            expect(updateProfilePictureResponse.statusCode).toBe(400);
        });

        it(
            "should returns the json user data",
            async () => {
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

                const testPathfile = path.resolve(
                    __dirname,
                    "../utils/img/test.avif",
                );

                // act
                const updateProfilePictureResponse = await request(app)
                    .post(`/api/user/update-profile-picture`)
                    .set("Cookie", [`accessToken=${accessToken}`])
                    .attach("avatar", testPathfile);

                // assert
                expect(updateProfilePictureResponse.body).toHaveProperty(
                    "user",
                );
            },
            TIMEOUT_INTERVAL,
        );

        it(
            "should returns the updated user avatar",
            async () => {
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

                const testPathfile = path.resolve(
                    __dirname,
                    "../utils/img/test.avif",
                );

                // act
                const updateProfilePictureResponse = await request(app)
                    .post(`/api/user/update-profile-picture`)
                    .set("Cookie", [`accessToken=${accessToken}`])
                    .attach("avatar", testPathfile);

                // assert
                expect(
                    updateProfilePictureResponse.body.user.avatar,
                ).not.toBeNull();
            },
            TIMEOUT_INTERVAL,
        );

        it(
            "should user avatar persist in database",
            async () => {
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

                const testPathfile = path.resolve(
                    __dirname,
                    "../utils/img/test.avif",
                );

                // act
                await request(app)
                    .post(`/api/user/update-profile-picture`)
                    .set("Cookie", [`accessToken=${accessToken}`])
                    .attach("avatar", testPathfile);

                // assert
                const users = await userRepository.find();
                expect(users[0].avatar).not.toBeNull();
            },
            TIMEOUT_INTERVAL,
        );
    });

    describe("Missing some fields", () => {
        it(
            "should returns the 400 status code if file is missing",
            async () => {
                const accessToken = jwt.token({
                    userId: "1",
                    role: UserRole.CUSTOMER,
                });

                const updateProfilePictureResponse = await request(app)
                    .post(`/api/user/update-profile-picture`)
                    .set("Cookie", [`accessToken=${accessToken}`]);

                expect(updateProfilePictureResponse.statusCode).toBe(400);
            },
            TIMEOUT_INTERVAL,
        );
    });
});
