/**
 * authentication related API implementation
 */
import * as authService from '../services/auth.service.js';
import httpStatus from 'http-status';
import {catchAsync} from '../utils/catch-async.js';

/**
 * user authentication application programming interface
 **/
export const login = catchAsync(async (req, res) => {
    const userLogin = await authService.login(req.body.username, req.body.password);
    res.status(httpStatus.CREATED).send(userLogin);
});
/**
 * logging out application programming interface
 **/
export const logout = catchAsync(async (req, res) => {
    const userLogout = await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send(userLogout);
});
/**
 * access token refresh application programming interface
 **/
export const refreshTokens = catchAsync(async (req, res) => {
    const newRefreshToken = await authService.refreshAuth(req.body.payload);
    res.status(httpStatus.CREATED).send(newRefreshToken);
});
/**
 * forgot password flow application programming interface
 **/
export const forgotPassword = catchAsync(async (req, res) => {
    const forgotPassword = await authService.forgotPassword(req.body.email);
    res.status(httpStatus.CREATED).send(forgotPassword);
});