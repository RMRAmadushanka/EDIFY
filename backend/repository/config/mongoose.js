/**
 * @file - mongoose
 * @description - This module acts as the connection to mongo db using Mongoose.
 * Connection to mongo db is exported externally for all database connectivity usages.
 *
 * Mongoose is a mongo db object modeling tool designed to work in an asynchronous environment.
 * Mongoose supports both promises and callbacks.
 */
import mongoose from "mongoose";
import logger from "../../config/logger.js";
import "../model/index.js";

const connect = () => {
  console.log("process.env.DB_USERNAME",process.env.DB_USERNAME);
  const DATABASE_URL = process.env.DB_CONNECTION_PREFIX
    + "://"
    + process.env.DB_USERNAME
    + ":"
    + process.env.DB_PASSWORD
    + "@"
    + process.env.DB_CLUSTER_URL
    + "/"
    + process.env.DB_NAME
    + "?retryWrites=true&w=majority&authSource=admin";
  /**
   * Event binding for mongoose
   */
  mongoose.connection.once("open", () => {
    logger.info("mongo db event open");
    logger.debug(`mongo db connected ${DATABASE_URL}`);

    mongoose.connection.on("connected", () => {
      logger.info("mongo db event connected");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("mongo db event disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("mongo db event reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("mongo db event error: " + err);
    });

    return Promise.resolve();
  });
  return mongoose
    .connect(`${process.env.DB_CONNECTION_PREFIX}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .catch((error) => logger.error("mongo db connection error: " + error));
};
/**
 * Exporting mongoose object with database connection
 */
export default connect;
