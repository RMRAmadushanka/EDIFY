/**
 * application entry point
 */
import dotenv from "dotenv";
dotenv.config();
import logger from './config/logger.js';
import app from './app.js';
//

import { initializeConnections } from "./utils/connection-initializer.js";

let server;
//
initializeConnections().then(() => {
    server = app.listen(process.env.PORT, () => {
        logger.info(`Listening to port ${process.env.PORT}`);
        logger.info(`Run on http://${process.env.HOST}:${process.env.PORT}/api/v1/docs`);
    });
});
//
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};
//
const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};
//
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
//
process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
