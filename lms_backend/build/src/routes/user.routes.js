"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const userRouter = express_1.default.Router();
//   /api/v1/user/
userRouter.post("/register", user_controller_1.userRegister);
userRouter.post("/activate-user", user_controller_1.userActivation);
userRouter.post("/login", user_controller_1.userLogin);
userRouter.get("/logout", user_controller_1.updateAccessToken, auth_1.isAuth, user_controller_1.userLogout);
userRouter.get("/refresh", user_controller_1.updateAccessToken);
userRouter.get("/me", user_controller_1.updateAccessToken, auth_1.isAuth, user_controller_1.getUserInfo);
userRouter.post("/social-auth", user_controller_1.socialAuth);
userRouter.put("/update-user-info", user_controller_1.updateAccessToken, auth_1.isAuth, user_controller_1.updateUserInfo);
userRouter.put("/update-user-password", user_controller_1.updateAccessToken, auth_1.isAuth, user_controller_1.updatePasswrod);
userRouter.put("/update-user-avatar", user_controller_1.updateAccessToken, auth_1.isAuth, user_controller_1.updateUserAvatar);
userRouter.get("/get-users", user_controller_1.updateAccessToken, auth_1.isAuth, (0, auth_1.authorizeRoles)("admin"), user_controller_1.getAllUsers);
userRouter.put("/update-user-role", user_controller_1.updateAccessToken, auth_1.isAuth, (0, auth_1.authorizeRoles)("admin"), user_controller_1.updateUserRole);
userRouter.delete("/delete-user/:id", user_controller_1.updateAccessToken, auth_1.isAuth, (0, auth_1.authorizeRoles)("admin"), user_controller_1.deleteUser);
exports.default = userRouter;
