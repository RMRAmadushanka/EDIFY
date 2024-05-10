/**
 * Authentication related business logics
 */
import * as keycloakService from "./keycloak.service.js";
import * as userService from "./user.service.js";
import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";

/**
 * Login with username and password
 */
export const login = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Credentials invalid");
  } else {
    const tokens = await keycloakService.logIn(username, password);
    return {
      user: user,
      tokens: {
        accessToken: tokens.access_token,
        expiresIn: tokens.expires_in,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        refreshExpiresIn: tokens?.refresh_expires_in,
      },
    };
  }
};
/**
 * User logout
 */
export const logout = async (refreshToken) => {
  return await keycloakService.logOut(refreshToken);
};
