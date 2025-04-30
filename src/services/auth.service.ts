import bcrypt from "bcrypt";
import crypto from "crypto";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import PasswordReset from "../models/reserPassword.model";
import User from "../models/user.model";
import sendMail from "../utils/sendMail";

interface SignUpParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface SignInParams {
  email: string;
  password: string;
}

export const signUp = async ({
  name,
  email,
  phone,
  password,
}: SignUpParams) => {
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return {
        statusCode: 400,
        payload: { message: "Email or phone exists" },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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

    return {
      statusCode: 201,
      payload: {
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
      },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      payload: { message: "Internal server error", error: error.message },
    };
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const user = await User.findOne({ email });
    if (!user)
      return {
        statusCode: 404,
        payload: { message: "Unregistered account!" },
      };

    if (!user.isActive)
      return {
        statusCode: 403,
        payload: {
          message: "Your account has been deactivated. Please contact support.",
        },
      };

    if (!user.password)
      return {
        statusCode: 500,
        payload: { message: "User password not found in database." },
      };

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return { statusCode: 400, payload: { message: "Wrong password!" } };

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "30d" }
    );

    return {
      statusCode: 200,
      payload: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      payload: { message: "Internal server error", error: error.message },
    };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user)
      return { statusCode: 404, payload: { message: "User not found" } };

    const otp = crypto.randomInt(100000, 999999).toString();
    const expired = new Date(Date.now() + 15 * 60 * 1000);

    const passwordReset = await PasswordReset.findOne({ email });
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
      content: `<html><h3 style="font-size: 24px; color: #4CAF50;">${otp}</h3></html>`,
    });

    return {
      statusCode: 200,
      payload: { success: true, message: "OTP sent to your email" },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      payload: { message: "Internal server error", error: error.message },
    };
  }
};

export const resetPassword = async ({
  email,
  otp,
  newPassword,
}: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  try {
    const passwordReset = await PasswordReset.findOne({ email, otp });
    if (!passwordReset)
      return { statusCode: 404, payload: { message: "Invalid OTP" } };

    if (dayjs(passwordReset.expired).diff(dayjs()) <= 0)
      return { statusCode: 400, payload: { message: "OTP has expired" } };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await PasswordReset.findOneAndDelete({ email });

    return {
      statusCode: 200,
      payload: { success: true, message: "Change password successfully" },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      payload: { message: "Internal server error", error: error.message },
    };
  }
};
