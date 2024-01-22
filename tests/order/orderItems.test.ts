import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { Category, Product, Shipping, User } from "../../src/entity";
import { UserRole } from "../../src/constants";

describe("[POST] /api/order", () => {
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

    const orderItemsData = {
        cart: JSON.stringify({ "1": 1 }),
        shippingId: "1",
    };

    const productData = {
        name: "Margarita",
        description: "This is very healthy pizza.",
        availability: true,
        preparationTime: 30,
        discount: 40,
        category: "pizza",
        ingredients: ["protein"],
        imageUrl: "dummy.png",
    };

    const shippingData = {
        address: "Near ZP school",
        city: "Barshi",
        postalCode: "134334",
    };

    describe("All fields are given", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            const productRepository = connection.getRepository(Product);
            const categoryRepository = connection.getRepository(Category);
            const shippingRepository = connection.getRepository(Shipping);

            const category = await categoryRepository.save({ name: "pizza" });
            const shipping = await shippingRepository.save(shippingData);
            const product = await productRepository.save({
                ...productData,
                category,
            });
            const user = await userRepository.save({ ...userData, shipping });

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/order")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(orderItemsData);

            console.log(postShippingResponse.body);
            // assert
            expect(postShippingResponse.statusCode).toBe(200);
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if item cart is missing", async () => {
            // arrange
            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/order")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({ ...orderItemsData, cart: "" });

            // assert
            expect(postShippingResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if item cart is missing", async () => {
            // arrange
            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/order")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({ ...orderItemsData, shippingId: "" });

            // assert
            expect(postShippingResponse.statusCode).toBe(400);
        });
    });
});
