import  moment from 'moment';
import { TOKEN_TYPES } from '../repository/config/constants.js';

/**
 * Generate forgot password token
 */
export const generateForgotPasswordToken = async (user) => {
    const expires = moment().add(config.jwt.forgotPasswordExpirationMinutes, 'minutes');
    const forgotPasswordToken = generateToken(user?.username, expires, TOKEN_TYPES.FORGOT_PASSWORD);
    await saveToken(forgotPasswordToken, user?.username, expires, TOKEN_TYPES.FORGOT_PASSWORD);
    return forgotPasswordToken;
}