import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { Shipping, User } from "../../src/entity";
import { UserRole } from "../../src/constants";
import { ShippingData } from "../../src/types/type";

describe("[POST] /api/shipping", () => {
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

    const shippingData: Omit<ShippingData, "user"> = {
        address: "Near ZP school",
        city: "Barshi",
        postalCode: "134334",
        country: "India",
    };

    describe("All fields are given", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            // assert
            expect(postShippingResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            // assert
            expect(
                (postShippingResponse.headers as Record<string, string>)[
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
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            // assert
            expect(postShippingResponse.statusCode).toBe(400);
        });

        it("should shipping address persist in database", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            // assert
            const shippingRepository = connection.getRepository(Shipping);
            const shippings = await shippingRepository.find();
            expect(shippings).toHaveLength(1);
        });
    });

    describe("Some fields are missing", () => {
        it("should return 400 status code if address is missing", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    ...shippingData,
                    address: "",
                });

            // assert
            expect(postShippingResponse.statusCode).toBe(400);
        });

        it("should return 400 status code if city is missing", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    ...shippingData,
                    city: "",
                });

            // assert
            expect(postShippingResponse.statusCode).toBe(400);
        });

        it("should return 400 status code if postal code is missing", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    ...shippingData,
                    postalCode: "",
                });

            // assert
            expect(postShippingResponse.statusCode).toBe(400);
        });

        it("should return 400 status code if postal code is not 6 digits", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            //  act
            const postShippingResponse = await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({
                    ...shippingData,
                    postalCode: "3434",
                });

            // assert
            expect(postShippingResponse.statusCode).toBe(400);
        });
    });
});
