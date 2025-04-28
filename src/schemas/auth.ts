import * as yup from "yup";

export const signUpSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required(),
  password: yup.string().min(8).required(),
});

export const signInSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export const resetPasswordSchema = yup.object().shape({
  email: yup.string().email().required(),
  otp: yup.string().length(6, "OTP must be exactly 6 characters").required(),
  newPassword: yup.string().min(8).required(),
});
