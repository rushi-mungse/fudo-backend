import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { User } from "../../src/entity";
import { UserRole } from "../../src/constants";

describe("[GET] /api/shipping/:shippingId", () => {
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

    const shippingData = {
        address: "Near ZP school",
        city: "Barshi",
        postalCode: "134334",
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
            const getShippingResponse = await request(app)
                .get("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingResponse.statusCode).toBe(200);
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
            const getShippingResponse = await request(app)
                .get("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(
                (getShippingResponse.headers as Record<string, string>)[
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
            const getShippingResponse = await request(app)
                .get("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if invalid shipping id", async () => {
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
            const getShippingResponse = await request(app)
                .get("/api/shipping/sdf")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if shipping id not found", async () => {
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
            const getShippingResponse = await request(app)
                .get("/api/shipping/2")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingResponse.statusCode).toBe(400);
        });

        it("should return shipping data", async () => {
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
            const getShippingResponse = await request(app)
                .get("/api/shipping/1")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingResponse.body).toHaveProperty("shipping");
        });
    });
});
