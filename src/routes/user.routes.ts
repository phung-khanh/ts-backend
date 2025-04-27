import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { checkLogin, isAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/check-email", userController.checkEmail);
router.post("/check-phone", userController.checkPhone);
router.get("/search", userController.searchUser);

// Private
router.get("/profile", checkLogin, userController.getProfile);
router.put("/profile", checkLogin, userController.updateProfile);
router.delete("/profile", checkLogin, userController.deleteAccount);

// Admin
router.get("/admin/users", checkLogin, isAdmin, userController.getAllUsers);
router.put(
  "/admin/deactivate/:id",
  checkLogin,
  isAdmin,
  userController.deactivateUser
);

export default router;
