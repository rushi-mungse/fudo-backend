import request from "supertest";
import createJwtMock from "mock-jwks";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { Category } from "../../src/entity";

describe("[POST] /api/category/:categoryId", () => {
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
            const updateCategoryResponse = await request(app)
                .post(`/api/category/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "updated pizza" });

            // assert
            expect(updateCategoryResponse.statusCode).toBe(200);
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
            const updateCategoryResponse = await request(app)
                .post(`/api/category/3`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "updated pizza" });

            // assert
            expect(updateCategoryResponse.statusCode).toBe(400);
        });

        it("should persist product category in database", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            await request(app)
                .post(`/api/category/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "updated pizza" });

            const categories = await categoryRepository.find();

            // assert
            expect(categories[0].name).toEqual("updated pizza");
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if category name is missing", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const updateCategoryResponse = await request(app)
                .post(`/api/category/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "" });

            // assert
            expect(updateCategoryResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if categoryId is invalid", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const updateCategoryResponse = await request(app)
                .post(`/api/category/erw`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "updated pizza" });

            // assert
            expect(updateCategoryResponse.statusCode).toBe(400);
        });
    });
});
