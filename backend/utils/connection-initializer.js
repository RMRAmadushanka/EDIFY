import { initializedDB } from "../services/master-data.service.js";
import logger from "../config/logger.js";
import connect from "../repository/config/mongoose.js";

export const initializeConnections = async () => {
  try {
    await initializeDbConnection();
    logger.info("database connected.");
  } catch (e) {
    console.log(e);
  }
};
/**
 *
 * @returns Initialize the DB instance and repository factory
 */
const initializeDbConnection = async () => {
  return new Promise(async (resolve, reject) => {
    try {

      //
      setTimeout(async () => {
        connect();
        await initializedDB();
        resolve();
      }, 1000);
    } catch (e) {
      reject(e);
    }
  });
};
//

