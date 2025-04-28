import express from "express";
import UserController from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/profile", UserController.getProfile);
userRouter.get("/:id", UserController.getUser);
// userRouter.post("/", checkLogin, isAdmin, UserController.createCategory);
userRouter.put("/profile", UserController.updateProfile);
userRouter.post(
  "/profile/change-password",

  UserController.changePassword
);
userRouter.put("/:id", UserController.updateUser);
userRouter.delete("/:id", UserController.deleteUser);
userRouter.put("/deactivate/:id", UserController.deactivateUser);

export default userRouter;
