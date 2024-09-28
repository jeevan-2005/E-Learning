import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserInfo,
  socialAuth,
  updateAccessToken,
  updatePasswrod,
  updateUserAvatar,
  updateUserInfo,
  updateUserRole,
  userActivation,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controller";
import { authorizeRoles, isAuth } from "../middlewares/auth";
const userRouter = express.Router();

//   /api/v1/user/
userRouter.post("/register", userRegister);
userRouter.post("/activate-user", userActivation);
userRouter.post("/login", userLogin);
userRouter.get("/logout", isAuth, userLogout);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuth, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuth, updateUserInfo);
userRouter.put("/update-user-password", isAuth, updatePasswrod);
userRouter.put("/update-user-avatar", isAuth, updateUserAvatar);
userRouter.get("/get-users", isAuth, authorizeRoles("admin"), getAllUsers);
userRouter.put("/update-user-role", isAuth, authorizeRoles("admin"), updateUserRole);
userRouter.delete("/delete-user/:id", isAuth, authorizeRoles("admin"), deleteUser);

export default userRouter;
