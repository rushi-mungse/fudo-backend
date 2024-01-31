import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { User } from "../../src/entity";

describe("[POST] /api/size", () => {
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
        name: "small",
    };

    describe("All fields are given", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const addProductSizeResponse = await request(app)
                .post("/api/size")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(addProductSizeResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const addProductSizeResponse = await request(app)
                .post("/api/size")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(
                (addProductSizeResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should returns the 400 status code if user not found", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "2",
                role: UserRole.ADMIN,
            });

            //  act
            const addProductSizeResponse = await request(app)
                .post("/api/size")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(sizeData);

            // assert
            expect(addProductSizeResponse.statusCode).toBe(400);
        });
    });

    describe("Some fields are missing", () => {
        it("should return 400 status code if product size name is missing", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            //  act
            const addProductSizeResponse = await request(app)
                .post("/api/size")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(addProductSizeResponse.statusCode).toBe(400);
        });
    });
});
