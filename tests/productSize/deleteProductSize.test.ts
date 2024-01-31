import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { Size, User } from "../../src/entity";
import { UserRole } from "../../src/constants";

describe("[DELETE] /api/size/:sizeId", () => {
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

    afterAll(async () => {
        await connection?.destroy();
    });

    afterEach(() => {
        jwt.stop();
    });

    const userData = {
        fullName: "Jon Doe",
        email: "jon.doe@gmail.com",
        password: "secret@password",
    };

    const sizeData = {
        size: "small",
    };

    describe("All fields are given", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const sizeRepository = connection.getRepository(Size);
            await sizeRepository.save(sizeData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const deleteProductSizeResponse = await request(app)
                .delete("/api/size/1")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(deleteProductSizeResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const sizeRepository = connection.getRepository(Size);
            await sizeRepository.save(sizeData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const deleteProductSizeResponse = await request(app)
                .delete("/api/size/1")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(
                (deleteProductSizeResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should returns the 400 status code if user not found", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const sizeRepository = connection.getRepository(Size);
            await sizeRepository.save(sizeData);

            const accessToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });

            //  act
            const deleteProductSizeResponse = await request(app)
                .delete("/api/size/1")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(deleteProductSizeResponse.statusCode).toBe(400);
        });

        it("should persist data in database", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const sizeRepository = connection.getRepository(Size);
            await sizeRepository.save(sizeData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const deleteProductSizeResponse = await request(app)
                .delete("/api/size/1")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            const sizes = await sizeRepository.find();
            expect(sizes).toHaveLength(0);
        });

        it("should return 400 if product size not found", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const sizeRepository = connection.getRepository(Size);
            await sizeRepository.save(sizeData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const deleteProductSizeResponse = await request(app)
                .delete("/api/size/2")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(deleteProductSizeResponse.statusCode).toBe(400);
        });

        it("should return 400 if product size id is invalid", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const sizeRepository = connection.getRepository(Size);
            await sizeRepository.save(sizeData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const deleteProductSizeResponse = await request(app)
                .delete("/api/size/erwer")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(deleteProductSizeResponse.statusCode).toBe(400);
        });
    });
});
