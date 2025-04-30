import * as UserService from "../services/user.service";
import { AuthenticatedRequest } from "../types/authencation";
import { asyncHandler } from "../utils/asyncHandler";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getAllUsers();
  res.json(users);
});

export const getProfile = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await UserService.getUserById(userId);
    res.json(user);
  }
);

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.getUserById(id);
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.updateUserById(id, req.body);
  res.json(user);
});

export const updateProfile = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await UserService.updateUserProfile(userId, req.body);
    res.json(user);
  }
);

export const changePassword = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { password, newPassword } = req.body;
    try {
      await UserService.changeUserPassword(userId, password, newPassword);
      res.json({ message: "Password changed successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.deleteUserById(id);
  res.json(user);
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isActive = await UserService.toggleUserActive(id);
  if (isActive === null)
    return res.status(404).json({ message: "User not found" });

  const message = isActive
    ? "User account activated successfully"
    : "User account deactivated successfully";
  res.json({ message });
});

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
