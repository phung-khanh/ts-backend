import bcrypt from "bcrypt";
import crypto from "crypto";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import PasswordReset from "../models/reserPassword.model";
import User from "../models/user.model";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/auth";
import { asyncHandler } from "../utils/asyncHandler";
import sendMail from "../utils/sendMail";

export const signUp = asyncHandler(async (req, res) => {
  try {
    await signUpSchema.validate(req.body, { abortEarly: false });
  } catch (validationError: any) {
    return res.status(400).json({ message: validationError.errors?.[0] });
  }

  const { name, email, phone, password } = req.body;

  try {
    const emailOrPhoneExists = await User.findOne({
      $or: [{ email }, { phone }],
    }).exec();
    if (emailOrPhoneExists)
      return res.status(400).json({ message: "Email or phone exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCount = await User.countDocuments();
    const role = userCount > 0 ? "USER" : "ADMIN";

    const newUser = await new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      address: "",
      loginMethod: "password",
    }).save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      status: true,
      message: "Register successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        loginMethod: newUser.loginMethod,
        address: newUser.address,
      },
      token,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export const signIn = asyncHandler(async (req, res) => {
  try {
    await signInSchema.validate(req.body, { abortEarly: false });
  } catch (validationError: any) {
    return res.status(400).json({ message: validationError.errors?.[0] });
  }
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({ email }).exec();
    if (!findUser)
      return res.status(404).json({ message: "Unregistered account!" });

    if (!findUser.isActive)
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact support.",
      });

    if (!findUser.password) {
      return res
        .status(500)
        .json({ message: "User password not found in database." });
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Wrong password!" });

    const token = jwt.sign(
      { id: findUser._id, email: findUser.email },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        phone: findUser.phone,
        role: findUser.role,
      },
      token,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    await forgotPasswordSchema.validate(req.body, { abortEarly: false });
  } catch (validationError: any) {
    return res.status(400).json({ message: validationError.errors?.[0] });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expired = new Date(Date.now() + 15 * 60 * 1000);

    const passwordReset = await PasswordReset.findOne({ email }).exec();
    if (passwordReset) {
      passwordReset.otp = otp;
      passwordReset.expired = expired;
      await passwordReset.save();
    } else {
      await new PasswordReset({ email, otp, expired }).save();
    }

    await sendMail({
      toEmail: email,
      title: "Password Reset OTP",
      content: `<html>...<h3 style="font-size: 24px; color: #4CAF50;">${otp}</h3>...</html>`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    await resetPasswordSchema.validate(req.body, { abortEarly: false });
  } catch (validationError: any) {
    return res.status(400).json({ message: validationError.errors?.[0] });
  }
  const { email, otp, newPassword } = req.body;

  try {
    const passwordReset = await PasswordReset.findOne({ email, otp }).exec();
    if (!passwordReset) return res.status(404).json({ message: "Invalid OTP" });

    if (dayjs(passwordReset.expired).diff(dayjs()) <= 0)
      return res.status(400).json({ message: "OTP has expired" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await PasswordReset.findOneAndDelete({ email });

    res.json({ success: true, message: "Change password successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

const AuthController = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
};

export default AuthController;
