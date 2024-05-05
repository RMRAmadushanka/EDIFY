/**
 * application entry point
 */
import dotenv from "dotenv";
dotenv.config();
import logger from "./config/logger.js";
import app from "./app.js";
//

let server;
//
server = app.listen(process.env.port, () => {
  logger.info(`Listening to port ${process.env.port}`);
});

//
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
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
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
//
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
