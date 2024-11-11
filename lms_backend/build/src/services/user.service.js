"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const user_model_1 = require("../models/user.model");
const redis_1 = require("../utils/redis");
const getUserById = async (id, res) => {
    const userJson = await redis_1.redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(201).json({
            success: true,
            user,
        });
    }
};
exports.getUserById = getUserById;
// get all users
const getAllUsersService = async (res) => {
    const users = await user_model_1.UserModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
};
exports.getAllUsersService = getAllUsersService;
const updateUserRoleService = async (res, id, role) => {
    const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        updatedUser,
    });
};
exports.updateUserRoleService = updateUserRoleService;
