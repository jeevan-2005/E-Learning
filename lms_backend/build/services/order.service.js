"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const order_model_1 = __importDefault(require("../models/order.model"));
exports.newOrder = (0, catchAsyncError_middleware_1.default)(async (data, res, next) => {
    const order = await order_model_1.default.create(data);
    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
    });
});
// get all orders
const getAllOrdersService = async (res) => {
    const orders = await order_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        orders,
    });
};
exports.getAllOrdersService = getAllOrdersService;
