import winston from "winston";
import { NODE_ENV } from "./config";

export default winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    defaultMeta: { serviceName: "fudo-service" },
    transports: [
        new winston.transports.File({
            level: "info",
            dirname: "logs",
            filename: "combined.log",
            silent: NODE_ENV === "test",
        }),

        new winston.transports.File({
            level: "error",
            dirname: "logs",
            filename: "error.log",
            silent: NODE_ENV === "test",
        }),

        new winston.transports.Console({
            level: "info",
            silent: NODE_ENV === "test",
        }),
    ],
});
