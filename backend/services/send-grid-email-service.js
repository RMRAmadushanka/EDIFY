
import config from "../config/config.js";
import sgMail from "@sendgrid/mail";
import  httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import logger from "../config/logger.js";
/**
 * send reset password email
 **/
export const sendResetPasswordEmail = async (toMail, userName, token) => {
    const resetPasswordUrl = `${config.frontEndUrl}/verify-callback?token=${token}`;
    const msg = {
      to: toMail,
      from: config.email.from,
      subject: "Forgot your password",
      templateId: config.email.sendgrid.forgotPasswordTemplateId,
      dynamic_template_data: {
        firstName: userName,
        url: resetPasswordUrl,
        env: config.env,
      },
    };
    try {
      await sgMail.send(msg);
      console.log("Success");
      return { message: "forgot password mail has sent" };
    } catch (e) {
      const { response } = e;
      logger.error(JSON.stringify(response.body));
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  };