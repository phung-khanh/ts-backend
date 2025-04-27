import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import { User } from "../model/user.model";
import { asyncHandler } from "../utils/asyncHandler";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRES_IN = "7d";

// Generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const userController = {
  // Register
  register: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  }),

  // Login
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  }),

  // Logout (Client chỉ cần xoá token)
  logout: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: "Logout successful" });
  }),

  // Check Email Exists
  checkEmail: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findUserByEmail(email);

    res.status(200).json({ exists: !!user });
  }),

  // Check Phone Exists
  checkPhone: asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;

    const result = await User.getAllUsers();
    const user = result.find((user) => user.phone === phone);

    res.status(200).json({ exists: !!user });
  }),

  // Search User by Name
  searchUser: asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query;

    const allUsers = await User.getAllUsers();
    const filteredUsers = allUsers.filter((user) =>
      user.name.toLowerCase().includes((name as string).toLowerCase())
    );

    res.status(200).json(filteredUsers);
  }),

  // Get Current Profile
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await User.findUserById(userId);

    res.status(200).json(user);
  }),

  // Update Profile
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const updateData = req.body;

    const updatedUser = await User.updateUser(userId, updateData);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }),

  // Delete Account
  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await User.deleteUser(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  }),

  // Admin: Get All Users
  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  }),

  // Admin: Deactivate User
  deactivateUser: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await User.deactivateUser(id);

    res.status(200).json({ message: "User deactivated successfully" });
  }),
};
