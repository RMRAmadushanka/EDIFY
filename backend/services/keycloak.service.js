/**
 * @file keycloak service
 * @summary wrapper service for the operations of keycloak application
 */
import  httpStatus from 'http-status';
import ApiError from '../utils/api-error.js';
import { getKeycloakAdmin } from '../config/keyclock-config.js';
import * as keycloakHttpClient from '../utils/keycloak-http-client.js';

/**
 * Create user on keycloak
 * @param {Object} user - User definition
 * @param {string} [user.username] - username
 * @param {string} [user.email] - email
 * @param {string} [user.password] - password
 * @returns {Promise}
 */
export const registerUser = async (user) => {
    try {
        console.log(user);
        
        const client = await getKeycloakAdmin();
        return await client.users.create({
            username: user.username,
            email: user.email,
            enabled: true,
            credentials: [{
                temporary: false,
                type: 'password',
                value: user.password,
            }]
        });
    } catch (error) {
        console.log("error",error);
        
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Update user details on keycloak
 * @param {Object} user - User definition
 * @param {Object} data - Updating data
 * @param {string} [user.username] - username
 * @param {string} [data.email] - email
 * @returns {Promise}
 */
export const updateUser = async (user, data) => {
    try {
        const client = await getKeycloakAdmin();
        const keycloakUser = await findUserByusername(user.username);

        return await client.users.update(
            {
                id: keycloakUser.id,
            }, {
            email: data.email
        });
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Delete user on keycloak
 * @param {string} username - User name
 * @returns {Promise}
 */
export const deleteUserByName = async (username) => {
    try {
        const client = await getKeycloakAdmin();
        const user = await findUserByusername(username);
        return await client.users.del(
            {
                id: user.id,
            });
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Reset user password on keycloak
 * @param {string} username - User name
 * @param {string} password - User password
 * @returns {Promise}
 */
export const resetPassword = async (username, password) => {
    try {
        const client = await getKeycloakAdmin();
        const user = await findUserByusername(username);
        return await client.users.resetPassword({
            id: user.id,
            credential: {
                temporary: false,
                type: 'password',
                value: password,
            },
        });
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Login user true keycloak
 * @param {string} username - User name
 * @param {string} password - User password
 * @returns {Promise}
 */
export const logIn = async (username, password) => {
    console.log("Keycloak service");
    try {
        const { data } = await keycloakHttpClient.login(username, password);
        return data;
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log("Keycloak service error");
            console.log(response);
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Credential invalid');
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Login service true keycloak
 * @param {string} clientId - Client id
 * @param {string} clientSecret - Client secret
 * @returns {Promise}
 */
export const serviceLogIn = async (clientId, clientSecret) => {
    try {
        const { data } = await keycloakHttpClient.serviceLogin(clientId, clientSecret);
        return data;
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Credential invalid');
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * User logout true keycloak
 * @param {string} refreshToken - User refresh token
 * @returns {Promise}
 */
export const logOut = async (refreshToken) => {
    try {
        await keycloakHttpClient.logOut(refreshToken);
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
            throw new ApiError(httpStatus.NOT_FOUND, 'Invalid refresh token');
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * User Refresh token true keycloak
 * @param {string} refreshToken - User refresh token
 * @returns {Promise}
 */
export const refreshToken = async (refreshToken) => {
    try {
        const { data } = await keycloakHttpClient.refreshToken(refreshToken);
        return data;
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
            if (response?.data?.error_description === "Session not active") {
                throw new ApiError(httpStatus.BAD_REQUEST, "Session not active");
            } else if (response?.data?.error_description === "Invalid refresh token") {
                throw new ApiError(httpStatus.BAD_REQUEST, "Invalid refresh token");
            } else if (response?.data?.error_description === "Token is not active") {
                throw new ApiError(httpStatus.BAD_REQUEST, "Token is not active");
            } else {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
            }
        } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
        }
    }
}
export const verifyUserEmail = async (token) => {

}
/**
 * Find user on keycloak by username
 * @param {string} username - User name
 * @returns {Promise}
 */
export const findUserByusername = async (username) => {
    try {
        const client = await getKeycloakAdmin();
        const userList = await client.users.find({ username: username });
        if (userList.length && userList.length > 0) {
            return userList[0];
        }
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Verify user password true keycloak
 * @param {string} password - User password
 * @param {string} username - User name
 * @returns {Promise}
 */
export const verifyPassword = async (password, username) => {
    try {
        const { data, status } = await keycloakHttpClient.login(username, password);
        if (status === 200) {
            await keycloakHttpClient.logOut(data.refresh_token);
        }
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password invalid');
    }
}
/**
 * Create role on keycloak
 * @param {string} roleName - Role name
 * @returns {Promise}
 */
export const createRole = async (roleName) => {
    try {
        const client = await getKeycloakAdmin();
        return await client.roles.create({
            name: roleName,
        });
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Find role by name on keycloak
 * @param {string} roleName - Role name
 * @returns {Promise}
 */
export const findRoleByName = async (roleName) => {
    try {
        const client = await getKeycloakAdmin();
        return await client.roles.findOneByName({ name: roleName });
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Delete role on keycloak
 * @param {string} roleName - Role name
 * @returns {Promise}
 */
export const deleteRoleByName = async (roleName) => {
    try {
        const client = await getKeycloakAdmin();
        return await client.roles.delByName({
            name: roleName,
        });
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Assign user role on keycloak
 * @param {string} username - User name
 * @param {string} roleName - Role name
 * @returns {Promise}
 */
export const assignRoleToUser = async (username, roleName) => {
    try {
        
        
        const user = await findUserByusername(username);
        const role = await findRoleByName(roleName);
        //
        const client = await getKeycloakAdmin();

        return await client.users.addRealmRoleMappings({
            id: user.id,
            roles: [
                {
                    id: role.id,
                    name: role.name,
                },
            ],
        });

    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Un assign user role on keycloak
 * @param {string} username - User name
 * @param {string} roleName - Role name
 * @returns {Promise}
 */
export const unAssignRoleFromUser = async (username, roleName) => {
    try {
        const user = await findUserByusername(username);
        const role = await findRoleByName(roleName);
        //
        const client = await getKeycloakAdmin();

        return await client.users.delRealmRoleMappings({
            id: user.id,
            roles: [
                {
                    id: role.id,
                    name: role.name,
                },
            ],
        });

    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Un assign user roles on keycloak
 * @param {string} username - User name
 * @param {array} roles - Roles
 * @returns {Promise}
 */
export const unAssignRolesFromUser = async (username, roles) => {
    try {
        const client = await getKeycloakAdmin();
        const user = await findUserByusername(username);
        const removeKeycloakRoles = [];
        for (const role of roles) {
            const keycloakRole = await findRoleByName(role.name);
            //
            removeKeycloakRoles.push({
                id: keycloakRole.id,
                name: keycloakRole.name,
            });
        }
        //
        return await client.users.delRealmRoleMappings({
            id: user.id,
            roles: removeKeycloakRoles
        });
    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
/**
 * Assign user roles on keycloak
 * @param {string} username - User name
 * @param {array} roles - Roles
 * @returns {Promise}
 */
export const assignRolesToUser = async (username, roles) => {
    try {
        const user = await findUserByusername(username);
        const client = await getKeycloakAdmin();
        const addKeycloakRoles = [];
        //
        for (const role of roles) {
            const keycloakRole = await findRoleByName(role.name);
            //
            addKeycloakRoles.push({
                id: keycloakRole.id,
                name: keycloakRole.name,
            });
        }

        return await client.users.addRealmRoleMappings({
            id: user.id,
            roles: addKeycloakRoles,
        });

    } catch (error) {
        const { response } = error;
        if (response) {
            console.log(response);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
}
