import request from "supertest";
import createJwtMock from "mock-jwks";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { Category } from "../../src/entity";

describe("[PUT] /api/category", () => {
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
        it("should returns the 201 status code if all ok", async () => {
            // arrange
            const category = {
                name: "pizza",
            };

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .put(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send(category);

            // assert
            expect(createCategoryResponse.statusCode).toBe(201);
        });

        it("should product category persist in database", async () => {
            // arrange
            const category = {
                name: "pizza",
            };

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            await request(app)
                .put(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send(category);

            const categoryRepository = connection.getRepository(Category);
            const categories = await categoryRepository.find();

            // assert
            expect(categories).toHaveLength(1);
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if name is missing", async () => {
            // arrange
            const category = {
                name: "",
            };

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .put(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send(category);

            // assert
            expect(createCategoryResponse.statusCode).toBe(400);
        });
    });
});
