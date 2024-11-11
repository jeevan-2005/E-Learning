"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateUserAvatar = exports.updatePasswrod = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.userLogout = exports.userLogin = exports.userActivation = exports.userRegister = void 0;
require("dotenv").config();
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const user_model_1 = require("../models/user.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const jwt_1 = __importStar(require("../utils/jwt"));
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = __importDefault(require("cloudinary"));
// user register
const userRegister = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    const { name, email, password } = req.body;
    const isEmailExist = await user_model_1.UserModel.findOne({ email });
    if (isEmailExist) {
        return next(new ErrorHandler_1.default("Email already exists", 400));
    }
    const user = {
        name,
        email,
        password,
    };
    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const dataForEmail = { user: { name: user.name }, activationCode };
    const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activationMail.ejs"), dataForEmail);
    try {
        await (0, mailSender_1.default)({
            email: user.email,
            subject: "Activate your account",
            template: "activationMail.ejs",
            data: { user: { name: user.name }, activationCode },
        });
        res.status(200).json({
            success: true,
            message: `Please check your email ${user.email} to activate your account.`,
            activationToken: activationToken.token,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.userRegister = userRegister;
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode,
    }, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
// activating user
const userActivation = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { activation_code, activation_token } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid activation code.", 400));
        }
        const { name, email, password } = newUser.user;
        const isEmailExist = await user_model_1.UserModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email already exists", 400));
        }
        const addUser = await user_model_1.UserModel.create({
            name,
            email,
            password,
        });
        return res.status(201).json({
            success: true,
            message: "user activated and registered successfully.",
            userDetails: {},
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.userActivation = userActivation;
const userLogin = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("please provide email and password", 400));
        }
        const user = await user_model_1.UserModel.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("User not found, invalid email or password", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        await (0, jwt_1.default)(user, res, 200);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.userLogin = userLogin;
// user logout
const userLogout = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        await redis_1.redis.del(req.user?._id);
        res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.userLogout = userLogout;
// update access token
const updateAccessToken = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler_1.default("Could not find refresh token", 400));
        }
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new ErrorHandler_1.default("Could not refresh token", 400));
        }
        const session = await redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "3d" });
        req.user = user; // but why?
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 7 * 24 * 60 * 60 // expires in 7 days
        );
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateAccessToken = updateAccessToken;
// get user info
const getUserInfo = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const id = req.user?._id;
        await (0, user_service_1.getUserById)(id, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getUserInfo = getUserInfo;
const socialAuth = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        const user = await user_model_1.UserModel.findOne({ email: email });
        if (!user) {
            let newAvatar = {};
            if (avatar) {
                const myCloudImage = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                newAvatar = {
                    public_id: myCloudImage.public_id,
                    url: myCloudImage.secure_url,
                };
            }
            const newUser = await user_model_1.UserModel.create({
                name,
                email,
                avatar: newAvatar,
            });
            await (0, jwt_1.default)(newUser, res, 200);
        }
        else {
            if (avatar && user) {
                if (user?.avatar?.public_id) {
                    await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                    const myCloudImage = await cloudinary_1.default.v2.uploader.upload(avatar, {
                        folder: "avatars",
                        width: 150,
                    });
                    user.avatar = {
                        public_id: myCloudImage.public_id,
                        url: myCloudImage.secure_url,
                    };
                }
                else {
                    // for social auth we dont get public_id.
                    const myCloudImage = await cloudinary_1.default.v2.uploader.upload(avatar, {
                        folder: "avatars",
                        width: 150,
                    });
                    user.avatar = {
                        public_id: myCloudImage.public_id,
                        url: myCloudImage.secure_url,
                    };
                }
            }
            await user.save();
            await (0, jwt_1.default)(user, res, 200);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.socialAuth = socialAuth;
const updateUserInfo = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { name } = req.body;
        const id = req.user?._id;
        const user = await user_model_1.UserModel.findById(id);
        if (name && user) {
            user.name = name;
        }
        await user?.save();
        await redis_1.redis.set(id, JSON.stringify(user));
        res.status(201).json({
            success: true,
            message: "User details updated successfully",
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateUserInfo = updateUserInfo;
const updatePasswrod = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Please enter old and new password", 400));
        }
        const user = await user_model_1.UserModel.findById(req.user?._id).select("+password");
        // user with social authentication
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("Invalid user", 400));
        }
        const isPassMatch = await user?.comparePassword(oldPassword);
        if (isPassMatch) {
            user.password = newPassword;
        }
        else {
            return next(new ErrorHandler_1.default("Please enter previous password correctly", 400));
        }
        await user?.save();
        await redis_1.redis.set(user?._id, JSON.stringify(user));
        return res.status(200).json({
            success: true,
            message: "Password modified successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updatePasswrod = updatePasswrod;
const updateUserAvatar = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const user = await user_model_1.UserModel.findById(req.user?._id);
        if (avatar && user) {
            if (user?.avatar?.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                const myCloudImage = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloudImage.public_id,
                    url: myCloudImage.secure_url,
                };
            }
            else {
                // for social auth we dont get public_id.
                const myCloudImage = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloudImage.public_id,
                    url: myCloudImage.secure_url,
                };
            }
        }
        await user?.save();
        await redis_1.redis.set(user?._id, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateUserAvatar = updateUserAvatar;
// get all users
const getAllUsers = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        (0, user_service_1.getAllUsersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllUsers = getAllUsers;
// update user role
const updateUserRole = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            return next(new ErrorHandler_1.default("Please enter email and role", 400));
        }
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        if (user && user._id) {
            const id = user._id.toString();
            (0, user_service_1.updateUserRoleService)(res, id, role);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateUserRole = updateUserRole;
// delete user -- by admin
const deleteUser = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.UserModel.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        await user.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteUser = deleteUser;
