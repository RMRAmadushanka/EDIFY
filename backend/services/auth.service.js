/**
 * Authentication related business logics
 */
import * as keycloakService from "./keycloak.service.js";
import * as userService from "./user.service.js";
import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import * as sendGirdEmailService from './send-grid-email-service.js'
import * as tokenService from './token.service.js'
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
/**
 * Refresh the access token
 */
export const refreshAuth = async (refreshToken) => {
  const tokens = await keycloakService.refreshToken(refreshToken);
  return {
      tokens: {
          accessToken: tokens.access_token,
          expiresIn: tokens.expires_in,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          refreshExpiresIn: tokens?.refresh_expires_in,
      }
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (email) => {

  const user = await userService.getUserByEmail(email);
  console.log(user);
  if (!user) {
      logger.info('not found for forgot password action ' + email);
      console.log("Error");
      return { message: 'forgot password email has sent' };
  } else {
      const token = await tokenService.generateForgotPasswordToken(user);
      const username = user?.firstName || user.username;
      return sendGirdEmailService.sendResetPasswordEmail(email, username, token);
  }
};