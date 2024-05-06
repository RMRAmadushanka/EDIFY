/**
 *  wrapper service for the operations of keycloak application
 */
import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import { getKeycloakAdmin } from "../config/keyclock-config.js";
/**
 * Create user on keycloak
 */
export const registerUser = async (user) => {
  try {
    const client = await getKeycloakAdmin();
    return await client.users.create({
      username: user.username,
      email: user.email,
      enabled: true,
      credentials: [
        {
          temporary: false,
          type: "password",
          value: user.password,
        },
      ],
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    const { response } = error;
    if (response) {
      console.log(response);
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/**
 * Create role on keycloak
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
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};
/**
 * Find role by name on keycloak
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
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/**
 * Assign user role on keycloak
 */
export const assignRoleToUser = async (username, roleName) => {
  try {
    const user = await findUserByUsername(username);
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
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/**
 * Find user on keycloak by username
 */
export const findUserByUsername = async (username) => {
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
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};
/**
 * Delete user on keycloak
 */
export const deleteUserByName = async (username) => {
  try {
    const client = await getKeycloakAdmin();
    const user = await findUserByUsername(username);
    return await client.users.del({
      id: user.id,
    });
  } catch (error) {
    const { response } = error;
    if (response) {
      console.log(response);
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};