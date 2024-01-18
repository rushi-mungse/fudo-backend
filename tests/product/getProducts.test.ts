import request from "supertest";
import { DataSource } from "typeorm";
import createJwtMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { Category, Product } from "../../src/entity";

describe("[GET] /api/product", () => {
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

    const product = {
        name: "Margarita",
        description: "This is very healthy pizza.",
        imageUrl: "ewerwer",
        availability: true,
        preparationTime: 30,
        discount: 40,
        category: "pizza",
        ingredients: ["protein"],
    };

    describe("Given all fields", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            const productRepository = connection.getRepository(Product);

            const category = await categoryRepository.save({ name: "pizza" });
            await productRepository.save({ ...product, category });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const getAllProductsResponse = await request(app)
                .get("/api/product")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(getAllProductsResponse.statusCode).toBe(200);
        });

        it("should return json data", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            const productRepository = connection.getRepository(Product);

            const category = await categoryRepository.save({ name: "pizza" });
            await productRepository.save({ ...product, category });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const getAllProductsResponse = await request(app)
                .get("/api/product")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(
                (getAllProductsResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });
    });
});
