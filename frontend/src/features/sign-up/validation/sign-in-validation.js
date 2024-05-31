import * as yup from 'yup';
/**
 * Function for sign in form validation
 */
const addFilterFormValidation = yup.object().shape({
  email: yup.string().email().required('Please Enter valid email'),
  password: yup.string().required('Please Enter valid password'),
});
//
export default addFilterFormValidation;
