import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { Shipping, User } from "../../src/entity";
import { UserRole } from "../../src/constants";
import { ShippingData } from "../../src/types/type";

describe("[DELETE] /api/shipping/:shippingId", () => {
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

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const deleteShippingResponse = await request(app)
                .delete("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(deleteShippingResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const deleteShippingResponse = await request(app)
                .delete("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(
                (deleteShippingResponse.headers as Record<string, string>)[
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

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const deleteShippingResponse = await request(app)
                .delete("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(deleteShippingResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if shipping address not found", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const deleteShippingResponse = await request(app)
                .delete("/api/shipping/2")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(deleteShippingResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if shipping address not belong to user", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);
            await userRepository.save(userData);

            const accessTokenForUser1 = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });
            const accessTokenForUser2 = jwt.token({
                userId: "2",
                role: UserRole.CUSTOMER,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessTokenForUser1}`])
                .send(shippingData);

            //  act
            const deleteShippingResponse = await request(app)
                .delete("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessTokenForUser2}`]);

            // assert
            expect(deleteShippingResponse.statusCode).toBe(400);
        });

        it("should shipping address persist in database", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            await request(app)
                .delete("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            const shippingRepository = connection.getRepository(Shipping);
            const shippings = await shippingRepository.find();
            expect(shippings).toHaveLength(0);
        });

        it("should return 400 status code if shipping id is invalid", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.CUSTOMER,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const deleteShippingResponse = await request(app)
                .delete("/api/shipping/rwerw")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert

            expect(deleteShippingResponse.statusCode).toBe(400);
        });
    });
});
