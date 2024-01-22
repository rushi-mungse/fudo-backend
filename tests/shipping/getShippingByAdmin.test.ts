import request from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { AppDataSource } from "../../src/config";
import { User } from "../../src/entity";
import { UserRole } from "../../src/constants";

describe("[GET] /api/shipping/admin/all-shippings", () => {
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
                role: UserRole.ADMIN,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const getShippingsResponse = await request(app)
                .get("/api/shipping/admin/all-shippings")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingsResponse.statusCode).toBe(200);
        });

        it("should returns the json data", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const getShippingsResponse = await request(app)
                .get("/api/shipping/admin/all-shippings")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(
                (getShippingsResponse.headers as Record<string, string>)[
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
                role: UserRole.ADMIN,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const getShippingsResponse = await request(app)
                .get("/api/shipping/admin/all-shippings")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingsResponse.statusCode).toBe(400);
        });

        it("should return shipping data", async () => {
            // arrange
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const accessToken = jwt.token({
                userId: "1",
                role: UserRole.ADMIN,
            });

            await request(app)
                .post("/api/shipping")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(shippingData);

            //  act
            const getShippingsResponse = await request(app)
                .get("/api/shipping/admin/all-shippings")
                .set("Cookie", [`accessToken=${accessToken}`]);

            // assert
            expect(getShippingsResponse.body.shippings).toHaveLength(1);
        });
    });
});
