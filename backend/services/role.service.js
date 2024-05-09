/**
 * role domain related business logics
 */
import httpStatus from "http-status";
//
import * as keycloakService from "./keycloak.service.js";
import ApiError from "../utils/api-error.js";
import {
  DATA_STATUS_TYPES,
  ROLE_TYPES,
} from "../repository/config/constants.js";
import RoleRepository from "../repository/role.repository.js";

/**
 * Create role
 **/
export const createRole = async (roleBody) => {
  const foundRole = await RoleRepository.findOne({ name: roleBody.name });
  if (foundRole) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already registered");
  }
  // Create role on keycloak
  const role = await keycloakService.findRoleByName(roleBody.name);
  if (!role) {
    await keycloakService.createRole(roleBody.name);
  }
  //
  roleBody.type = ROLE_TYPES.SYSTEM;
  return RoleRepository.save(roleBody);
};

/**
 * Create default roles on keycloak
 **/
export const createDefaultRolesInOrganization = async (roleNames) => {
  for (const roleName of roleNames) {
    const role = await getRoleByName(roleName);
    if (!role) {
      await createRole({
        name: roleName,
        dataStatus: DATA_STATUS_TYPES.ACTIVE,
      });
    }
  }
};

/**
 * Get role by name
 **/
export const getRoleByName = async (name) => {
  return RoleRepository.findOne({ name, dataStatus: DATA_STATUS_TYPES.ACTIVE });
};
/**
 * Get role
 * @param {string} roleId
 * @returns {Promise <Role>}
 **/
export const getRoleById = async (roleId) => {
  const role = await RoleRepository.findOne({
    _id: roleId,
    dataStatus: DATA_STATUS_TYPES.ACTIVE,
  });
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  return role;
};