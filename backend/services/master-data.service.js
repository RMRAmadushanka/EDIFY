/**
 * initial system data manageable service for the application
 */
import * as userService from "./user.service.js";
import * as roleService from "./role.service.js";
import logger from '../config/logger.js';
import { DATA_STATUS_TYPES, SYSTEM_ROLES } from '../repository/config/constants.js';

/**
 * Initialize the master data into the application
 */
export const initializedDB = async () => {
    try {
        await addSystemRoles();
        await addMasterUser();
    } catch (e) {
        logger.error(e);
    }
}
/**
 * Added the system roles
 */
export const addSystemRoles = async () => {
    await roleService.createDefaultRolesInOrganization(SYSTEM_ROLES);
}
/**
 * Added master user into the database
 */
export const addMasterUser = async () => {
    const userBody = {
        username: process.env.MASTER_USERNAME,
        firstName: 'super',
        lastName: 'user',
        dataStatus: DATA_STATUS_TYPES.ACTIVE,
        email: process.env.MASTER_USERNAME,
        password: process.env.MASTER_PASSWORD
    }
    let superUser = await userService.getUserByUsername(process.env.MASTER_USERNAME);
    if (!superUser) {
        superUser = await userService.createUser( userBody);
        logger.info('master user created : ' + superUser?._id);
        const adminRole = await roleService.getRoleByName('super-admin');
        const roleArray = [];
        roleArray.push(adminRole);
        await userService.assignRolesToUser( superUser?._id, { roles: roleArray });
        logger.info('master user assigned super-admin role : ' + adminRole?._id);
    }
}




