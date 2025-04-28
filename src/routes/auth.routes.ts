import express from "express";
import AuthController from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", AuthController.signUp);
authRouter.post("/login", AuthController.signIn);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);

export default authRouter;
