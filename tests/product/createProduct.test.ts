import request from "supertest";
import { DataSource } from "typeorm";
import createJwtMock from "mock-jwks";
import path from "path";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { Product, Size } from "../../src/entity";

describe("[POST] /api/product", () => {
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
        availability: true,
        preparationTime: 30,
        discount: 40,
        category: "pizza",
        ingredients: ["protein"],
        currency: "IND",
    };

    const sizeAndPrices = {
        small: 100,
        medium: 200,
        large: 300,
    };

    describe("Given all fields", () => {
        it("should returns the 201 status code if all ok", async () => {
            const sizeRepository = await connection.getRepository(Size);
            await sizeRepository.save({ size: "small" });
            await sizeRepository.save({ size: "medium" });
            await sizeRepository.save({ size: "large" });

            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            const testPathfile = path.resolve(
                __dirname,
                "../utils/img/test.avif",
            );

            // act
            await await request(app)
                .put(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "pizza" });

            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza")
                .field("description", "This is pizza food from heart.")
                .field("discount", 10)
                .field("availability", true)
                .field("category", "pizza")
                .field("currency", "IND")
                .field("preparationTime", 50)
                .field("ingredients", JSON.stringify(["protein"]))
                .field("sizeAndPrices", JSON.stringify(sizeAndPrices))
                .attach("image", testPathfile);

            // assert
            expect(createProductResponse.statusCode).toBe(201);
        });

        it("should return json data", async () => {
            // arrange
            const sizeRepository = await connection.getRepository(Size);
            await sizeRepository.save({ size: "small" });
            await sizeRepository.save({ size: "medium" });
            await sizeRepository.save({ size: "large" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            const testPathfile = path.resolve(
                __dirname,
                "../utils/img/test.avif",
            );

            await await request(app)
                .put(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "pizza" });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza")
                .field("description", "This is pizza food from heart.")
                .field("discount", 10)
                .field("availability", true)
                .field("category", "pizza")
                .field("currency", "IND")
                .field("preparationTime", 50)
                .field("ingredients", JSON.stringify(["protein"]))
                .field("sizeAndPrices", JSON.stringify(sizeAndPrices))
                .attach("image", testPathfile);

            // assert
            expect(
                (createProductResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist product in database", async () => {
            // arrange
            const sizeRepository = await connection.getRepository(Size);
            await sizeRepository.save({ size: "small" });
            await sizeRepository.save({ size: "medium" });
            await sizeRepository.save({ size: "large" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            const testPathfile = path.resolve(
                __dirname,
                "../utils/img/test.avif",
            );

            await await request(app)
                .put(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ name: "pizza" });

            // act
            const response = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza")
                .field("description", "This is pizza food from heart.")
                .field("discount", 10)
                .field("availability", true)
                .field("category", "pizza")
                .field("currency", "IND")
                .field("preparationTime", 50)
                .field("ingredients", JSON.stringify(["protein"]))
                .field("sizeAndPrices", JSON.stringify(sizeAndPrices))
                .attach("image", testPathfile);

            // assert
            const productRepository = connection.getRepository(Product);
            const products = await productRepository.find();
            expect(products).toHaveLength(1);
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if name is missing", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, name: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if description is missing", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, description: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if availability is missing", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, availability: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if preparation time is missing", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, preparationTimeInMinute: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if category is missing", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, category: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if ingredients is missing", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, ingredients: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });
    });
});
