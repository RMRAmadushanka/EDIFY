import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useIsAuthenticated from "../../../base/hooks/use-is-authenticated";
import { signInActions } from "../../slice";
import ROUTES from "../../../base/constants/routes";
import { ERROR_CODES } from "../../../base/constants/errors";
import {
  selectSignInErrorCode,
  selectSignInErrorMessage,
  selectSignUpLoading,
} from "../../selectors";
import { getRefreshToken } from "../../../base/helpers/token";

const SignInModal = ({ closeModal }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthenticated } = useIsAuthenticated();
  const handleToggleForm = () => {
    setIsSignUp((prev) => !prev);
  };
  const errorMessage = useSelector(selectSignInErrorMessage);
  const errorCode = useSelector(selectSignInErrorCode);
  const loading = useSelector(selectSignUpLoading);
  const refreshToken = getRefreshToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(2, "Password must be at least 8 characters")
      .required("Password is required"),
    ...(isSignUp && {

      email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
    }),
  });

  const initialValues = {
    username: "",
    password: "",
    ...(isSignUp && {
      email: "",
      phoneNumber: "",
    }),
  };

  const handleSubmit = (values, { setSubmitting,resetForm  }) => {
    if (isSignUp) {
      dispatch(signInActions.signUp(values));
      resetForm()
    } else {
      dispatch(signInActions.signIn(values));
      resetForm()
    }
    setSubmitting(false);
  };


  useEffect(() => {
    if (isAuthenticated(refreshToken)) {
      navigate(ROUTES.DASHBOARD);
    } else if (errorCode?.toString() === ERROR_CODES.UNAUTHORIZED) {
      navigate(ROUTES.NOT_AUTHORIZED);
    }
    if (loading) {
      setIsSignUp(false); // Switch to sign-in form on successful sign-up
    }
  }, [isAuthenticated, errorMessage, refreshToken, loading]);
  //

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          &#10005;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          {isSignUp ? "Create your account." : "Login to manage your account."}
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              {isSignUp && (
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {isSignUp && (
                <div className="mb-4">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    country={"us"}
                    value={""}
                    onChange={(value) => setFieldValue("phoneNumber", value)}
                    inputStyle={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      outline: "none",
                      fontSize: "16px",
                    }}
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={isSubmitting}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="flex items-center justify-center my-6">
          <span className="border-b w-full border-gray-300"></span>
          <span className="text-gray-400 mx-4">OR</span>
          <span className="border-b w-full border-gray-300"></span>
        </div>
        <button className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition duration-300 flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google"
            className="h-6 w-6 mr-2"
          />
          {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
        </button>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignUp ? "Already have an account?" : "Do not have an account?"}{" "}
            <a
              href="#"
              onClick={handleToggleForm}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </a>
          </p>
          {!isSignUp && (
            <p className="text-gray-600">
              <a href="#" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
