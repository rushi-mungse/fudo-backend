import request from "supertest";
import { DataSource } from "typeorm";
import createJwtMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { UserRole } from "../../src/constants";
import { Category, Product } from "../../src/entity";

describe("[POST] /api/product/:productId", () => {
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
        ingredients: ["Protein"],
        currency: "IND",
    };

    const sizeAndPrices = {
        small: 100,
        medium: 200,
        large: 300,
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza1")
                .field("description", "This is pizza food from heart.")
                .field("discount", 20)
                .field("availability", true)
                .field("category", "pizza")
                .field("currency", "IND")
                .field("preparationTime", 50)
                .field("ingredients", JSON.stringify(["protein"]))
                .field("sizeAndPrices", JSON.stringify(sizeAndPrices));

            // assert
            expect(updateProductResponse.statusCode).toBe(200);
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza1")
                .field("description", "This is pizza food from heart.")
                .field("discount", 20)
                .field("availability", true)
                .field("currency", "IND")
                .field("preparationTime", 50)
                .field("ingredients", JSON.stringify(["protein"]))
                .field("sizeAndPrices", JSON.stringify(sizeAndPrices));

            // assert
            expect(
                (updateProductResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist product in database", async () => {
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
            await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza1")
                .field("description", "This is pizza food from heart.")
                .field("discount", 20)
                .field("availability", true)
                .field("category", "pizza")
                .field("currency", "IND")
                .field("preparationTime", 50)
                .field("ingredients", JSON.stringify(["protein"]))
                .field("sizeAndPrices", JSON.stringify(sizeAndPrices));

            // assert
            const products = await productRepository.find();
            expect(products[0].name).toEqual("pizza1");
            expect(products[0].availability).toEqual(true);
            expect(products).toHaveLength(1);
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if name is missing", async () => {
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, name: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if description is missing", async () => {
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, description: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if availability is missing", async () => {
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, availability: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if preparation time is missing", async () => {
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, preparationTime: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if category is missing", async () => {
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, category: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if ingredients is missing", async () => {
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
            const updateProductResponse = await request(app)
                .post(`/api/product/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, ingredients: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if product id is invalid", async () => {
            // arrange
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
            const deleteProductResponse = await request(app)
                .delete("/api/product/sdfd")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(deleteProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if product id is not found", async () => {
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
            const deleteProductResponse = await request(app)
                .delete("/api/product/2")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(deleteProductResponse.statusCode).toBe(400);
        });
    });
});
