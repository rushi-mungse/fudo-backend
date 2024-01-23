import request from "supertest";
import { DataSource } from "typeorm";
import createJwtMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { Category } from "../../src/entity";

describe("[GET] /api/category/:categoryId", () => {
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
            const categoryRepository = connection.getRepository(Category);
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .get(`/api/category/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.statusCode).toBe(200);
        });

        it("should returns the 400 status code if category not found", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .get(`/api/category/3`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.statusCode).toBe(400);
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if categoryId is invalid", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .get(`/api/category/erw`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.statusCode).toBe(400);
        });
    });
});
