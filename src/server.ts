import app from "./app";
import { AppDataSource, PORT, logger } from "./config/config";

const startServer = async () => {
    try {
        /**
         * initialize data source postgress database using typeorm
         */
        await AppDataSource.initialize();
        logger.info("Database connected successfully!");

        app.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        if (error instanceof Error) logger.error(error.message);
        else logger.error("Internal Server Error");
    }
};

void startServer();
