import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/auth";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const signUp = asyncHandler(async (req, res) => {
  await signUpSchema.validate(req.body, { abortEarly: false });
  const result = await authService.signUp(req.body);
  res.status(result.statusCode).json(result.payload);
});

export const signIn = asyncHandler(async (req, res) => {
  await signInSchema.validate(req.body, { abortEarly: false });
  const result = await authService.signIn(req.body);
  res.status(result.statusCode).json(result.payload);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await forgotPasswordSchema.validate(req.body, { abortEarly: false });
  const result = await authService.forgotPassword(req.body.email);
  res.status(result.statusCode).json(result.payload);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await resetPasswordSchema.validate(req.body, { abortEarly: false });
  const result = await authService.resetPassword(req.body);
  res.status(result.statusCode).json(result.payload);
});

const AuthController = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
};

export default AuthController;
