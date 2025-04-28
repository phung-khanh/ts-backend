import bcrypt from "bcrypt";
import User from "../models/user.model";
import { AuthenticatedRequest } from "../types/authencate";
import { asyncHandler } from "../utils/asyncHandler";

export const getUsers = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  const users = await User.find().sort("-createdAt").exec();
  res.json(users);
});

export const getProfile = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).exec();
    res.json(user);
  }
);

export const getUser = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).exec();
  res.json(user);
});

export const updateUser = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const { id } = req.params;
    const { name, avatar, address, gender, birthday, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, avatar, address, gender, birthday, role },
      { new: true }
    ).exec();

    res.json(user);
  }
);

export const updateProfile = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, avatar, address, gender, birthday, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, avatar, address, gender, birthday, phone },
      { new: true }
    ).exec();

    res.json(user);
  }
);

export const changePassword = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { password, newPassword } = req.body;
    const user = await User.findById(userId).exec();

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(
      password,
      String(user.password)
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Current password incorrect!" });

    const isSameOldPassword = await bcrypt.compare(
      newPassword,
      String(user.password)
    );
    if (isSameOldPassword)
      return res
        .status(406)
        .json({ message: "New password must be different" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { password: hashedPassword }).exec();

    res.json({ message: "Password changed successfully" });
  }
);

export const deleteUser = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).exec();
    res.json(user);
  }
);

export const deactivateUser = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).exec();
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    const message = user.isActive
      ? "User account activated successfully"
      : "User account deactivated successfully";

    res.json({ message });
  }
);

const UserController = {
  getUsers,
  getUser,
  getProfile,
  updateUser,
  updateProfile,
  changePassword,
  deleteUser,
  deactivateUser,
};

export default UserController;
