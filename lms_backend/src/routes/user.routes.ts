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
userRouter.get("/logout", updateAccessToken, isAuth, userLogout);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", updateAccessToken, isAuth, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", updateAccessToken, isAuth, updateUserInfo);
userRouter.put(
  "/update-user-password",
  updateAccessToken,
  isAuth,
  updatePasswrod
);
userRouter.put(
  "/update-user-avatar",
  updateAccessToken,
  isAuth,
  updateUserAvatar
);
userRouter.get(
  "/get-users",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  getAllUsers
);
userRouter.put(
  "/update-user-role",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/delete-user/:id",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
