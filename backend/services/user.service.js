/**
 * User domain related business logics
 */
import httpStatus from "http-status";
//
import * as keycloakService from "./keycloak.service.js";
import * as roleService from "./role.service.js";
import ApiError from "../utils/api-error.js";
import { DATA_STATUS_TYPES } from "../repository/config/constants.js";
import UserRepository from "../repository/user.repository.js";

/**
 * Create user
 **/
export const createUser = async (userBody) => {
  const foundByEmail = await UserRepository.findOne({ email: userBody.email });
  const foundByUserName = await UserRepository.findOne({
    username: userBody.username,
  });
  if (foundByEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exist");
  } else if (foundByUserName) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already exist");
  } else {
    try {
      const userRole = await roleService.getRoleByName("user");
      const userRoles = [];
      userRoles.push(userRole);
      userBody.roles = userRoles;
      // create a keycloak user
      await keycloakService.registerUser(userBody);
      // assign role user to created user
      await keycloakService.assignRoleToUser(userBody.username, "user");
      // create user in db
      return UserRepository.save(userBody);
    } catch (e) {
      const keycloakUser = await keycloakService.findUserByUsername(
        userBody.username
      );
      if (!keycloakUser) {
        await keycloakService.deleteUserByName(userBody.username);
      }
      throw e;
    }
  }
};

/**
 * Get user
 **/
export const getUserById = async (userId) => {
  const user = await UserRepository.findOne({
    _id: userId,
    dataStatus: DATA_STATUS_TYPES.ACTIVE,
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};
/**
 * Get user by username
 **/
export const getUserByUsername = async (username) => {
  return UserRepository.findOne({
    username,
    dataStatus: DATA_STATUS_TYPES.ACTIVE,
  });
};

/**
 * Assign user roles
 **/
export const assignRolesToUser = async (userId, { roles }) => {
  const user = await getUserById(userId);
  // requestValidator updating roles
  const newRoles = [];
  roles = roles.filter((value, index, self) => self.indexOf(value) === index);
  for (const roleId of roles) {
    const role = await roleService.getRoleById(roleId);
    newRoles.push(role);
  }
  // un assign previous roles
  await keycloakService.unAssignRolesFromUser(user.username, user.roles);
  // assign new roles
  user.roles = newRoles;
  await keycloakService.assignRolesToUser(user.username, newRoles);
  await UserRepository.update(user);
};
/**
 * Get user by email
 **/
export const getUserByEmail = async (email) => {
  return UserRepository.findOne({
    email,
    dataStatus: DATA_STATUS_TYPES.ACTIVE,
  });
};