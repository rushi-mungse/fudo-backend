import { DataSource } from "typeorm";
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME, DB_NAME } from "./";

export default new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false,
    logging: false,
    entities: ["../src/entity/*.ts"],
    migrations: [],
    subscribers: [],
});
