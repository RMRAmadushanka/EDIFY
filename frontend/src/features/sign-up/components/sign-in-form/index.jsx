import { Formik } from "formik";
import { useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router-dom";
//
import ROUTES from "features/base/constants/routes";
import { signInActions } from "features/sign-in/slice";
import { selectLoader, selectMergePopupOpen } from "features/sign-in/selectors";
import { selectNotification } from "features/base/notifications/selector";
import { TextField, Button } from "features/base/components";
import ButtonGrid from "features/base/components/left-right-btn-grid";
import signInFormValidation from "features/sign-in/validation/sign-in-validation";
import googleIcon from "features/base/assets/images/png/google-Icon.png";
import loaderIcon from "features/base/assets/images/gif/loader.gif";
import TOAST_TYPES from "features/base/constants/toast-types";
import ERROR_TYPES from "features/base/constants/error-types";
import { notificationActions } from "features/base/notifications/slice";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.scss";

/**
 * Sign in form component
 * @param {setOpen} param0
 * @returns {Formik}
 */
const SignInForm = ({ setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const mergePopupOpen = useSelector(selectMergePopupOpen);
  //
  const receiveMessage = (event) => {
    if (event?.data?.code || event?.data?.error) {
      dispatch(signInActions.setAuthData({ data: event.data }));
      if (mergePopupOpen) {
        dispatch(signInActions.handleMergeModalChange(false));
      }
      navigate(ROUTES.GOOGLE_AUTH);
    }
  };
  //
  const loading = useSelector(selectLoader);
  const notification = useSelector(selectNotification);
  //
  const handleOnClose = () => {
    setOpen(false);
    dispatch(notificationActions.resetNotification());
  };
  //
  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);
  }, []);
  //
  useEffect(() => {
    if (notification?.isEnabled && notification?.type === ERROR_TYPES.SUCCESS) {
      toast(notification?.message, { type: TOAST_TYPES.SUCCESS });
    }
  }, [notification]);
  //
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={signInFormValidation}
      onSubmit={async (values) => {
        dispatch(signInActions.signIn(values));
        dispatch(notificationActions.resetNotification());
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit} className="form">
          <Box>
            {loading ? (
              <Skeleton
                baseColor="#E7E6EA"
                height="20px"
                style={{ marginBottom: "10px" }}
              />
            ) : (
              <Typography>
                Internal users must use Google log in option.
              </Typography>
            )}
          </Box>
          {notification?.isEnabled &&
            notification?.type === ERROR_TYPES.ERROR && (
              <Alert sx={{ mb: 3 }} severity={notification?.type}>
                {notification?.message}
              </Alert>
            )}
          <Box className="google-login-btn">
            {loading ? (
              <Skeleton
                baseColor="#E7E6EA"
                height="40px"
                style={{ marginBottom: "20px" }}
              />
            ) : (
              <Button
                onClick={() => dispatch(signInActions.openOAuthWindow())}
                fullWidth
                disabled={isSubmitting}
                icon={googleIcon}
                pattern="secondary"
                sx={{
                  p: "10px 10px !important",
                  height: "auto !important",
                  textTransform: "none",
                }}
              >
                Login with Google
              </Button>
            )}
          </Box>
          {loading ? (
            <Skeleton
              baseColor="#E7E6EA"
              height="20px"
              style={{ marginBottom: "20px" }}
            />
          ) : (
            <Box>
              <div className="is-divider">
                <div className="inText">or</div>
              </div>
            </Box>
          )}
          <Box>
            {loading ? (
              <Skeleton
                baseColor="#E7E6EA"
                height="37px"
                style={{ marginBottom: "20px" }}
              />
            ) : (
              <TextField
                className="form-field"
                type="email"
                name="email"
                value={values.email}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email"
              />
            )}
            {loading ? (
              <Skeleton
                baseColor="#E7E6EA"
                height="37px"
                style={{ marginBottom: "30px" }}
              />
            ) : (
              <TextField
                type="password"
                name="password"
                value={values.password}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
              />
            )}
            {loading ? (
              <Skeleton
                baseColor="#E7E6EA"
                height="20px"
                style={{ marginBottom: "10px" }}
              />
            ) : (
              <Typography>
                <Link
                  to="/forgot-password/email"
                  onClick={handleOnClose}
                  className="Forgot-password-txt"
                >
                  Forgot password?
                </Link>
              </Typography>
            )}
          </Box>
          <ButtonGrid
            leftButtonText="Cancel"
            rightButtonText={loading ? "Submitting" : "Login"}
            leftOnClick={handleOnClose}
            rightOnClick={null}
            rightIcon={loading ? loaderIcon : null}
          />
        </form>
      )}
    </Formik>
  );
};
//
export default SignInForm;
