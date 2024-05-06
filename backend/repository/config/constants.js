/**
 * use to store static system data in one place
 */
/**
 * available token types
 */
export const TOKEN_TYPES = {
    ACCESS: 'ACCESS',
    REFRESH: 'REFRESH',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    RESET_PASSWORD: 'RESET_PASSWORD',
    VERIFY_EMAIL: 'VERIFY_EMAIL',
};
/**
 * available token status
 */
export const TOKEN_STATUS = {
    PENDING: 'PENDING',
    USED: 'USED'
};
/*
 * available system roles
 */
export const SYSTEM_ROLES = ['admin', 'super-admin', 'user', 'guest'];
/**
 * available role types
 */
export const ROLE_TYPES = {
    SYSTEM: "SYSTEM",
    CUSTOM: "CUSTOM",
}
/**
 * Available contact methods
 */
export const CONTACT_METHODS = ['EMAIL', 'SMS'];
/**
 * Available data status
 */

export const DATA_STATUS_TYPES = {
    ACTIVE: "ACTIVE",
    DELETED: "DELETED"
}
//
export const REPOSITORY_FACTORY = 'REPOSITORY_FACTORY';
