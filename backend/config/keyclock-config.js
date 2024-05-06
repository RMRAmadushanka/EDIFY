/**
 * configurations related to keycloak
 */
import dotenv from "dotenv";
dotenv.config();
import Keycloak from 'keycloak-connect';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import logger from './logger.js';
//
console.log(process.env.CLIENT_ID);
let keycloak;
/**
 * Initialize the keyclock account
 */
const keycloakConfig = {
    clientId: process.env.CLIENT_ID,
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_URL,
    realm: process.env.REALM_NAME,
    credentials: {
        secret: process.env.CLIENT_SECRET
    }
};
/**
 * Initialize the keyclock admin account
 */
const keycloakAdminConfig = {
    grantType: 'password',
    clientId: process.env.MASTER_CLIENT_ID,
    clientSecret: process.env.MASTER_CLIENT_SECRET,
    username: process.env.KEYCLOAK_ADMIN,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD
};
/**
 * Use to initialize keycloak connect
 */
export const initKeycloak = (memoryStore) => {
    if (keycloak) {
        logger.warn("Trying to init Keycloak again!");
        return keycloak;
    } else {
        logger.info("Initializing Keycloak...");
        keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return keycloak;
    }
}
/**
 * Get keycloak instance
 */
export const getKeycloak = () => {
    if (!keycloak) {
        logger.error('Keycloak has not been initialized. Please called init first.');
    }
    return keycloak;
}
/**
 * Get keycloak admin instance
 */
export const getKeycloakAdmin = async () => {
    let admin = new KcAdminClient({
        baseUrl: process.env.KEYCLOAK_URL,
        realmName: 'master',
    });
    //
    await admin.auth(keycloakAdminConfig);
    await admin.setConfig({
        realmName: process.env.REALM_NAME
    });
    return admin;
}
