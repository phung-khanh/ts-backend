import bcrypt from "bcrypt";
import User from "../models/user.model";

export const getAllUsers = () => User.find().sort("-createdAt").exec();

export const getUserById = (id: string) => User.findById(id).exec();

export const updateUserById = (id: string, data: any) =>
  User.findByIdAndUpdate(id, data, { new: true }).exec();

export const updateUserProfile = (userId: string, data: any) =>
  User.findByIdAndUpdate(userId, data, { new: true }).exec();

export const deleteUserById = (id: string) => User.findByIdAndDelete(id).exec();

export const toggleUserActive = async (id: string) => {
  const user = await User.findById(id).exec();
  if (!user) return null;
  user.isActive = !user.isActive;
  await user.save();
  return user.isActive;
};

export const changeUserPassword = async (
  userId: string,
  password: string,
  newPassword: string
) => {
  const user = await User.findById(userId).exec();
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, String(user.password));
  if (!isPasswordValid) throw new Error("Current password incorrect");

  const isSameOldPassword = await bcrypt.compare(
    newPassword,
    String(user.password)
  );
  if (isSameOldPassword) throw new Error("New password must be different");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await User.findByIdAndUpdate(userId, { password: hashedPassword }).exec();
};
