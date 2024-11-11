"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const orderRouter = express_1.default.Router();
orderRouter.post("/create-order", user_controller_1.updateAccessToken, auth_1.isAuth, order_controller_1.createOrder);
orderRouter.get("/get-all-orders", user_controller_1.updateAccessToken, auth_1.isAuth, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getAllOrders);
orderRouter.get("/payment/stripe-publishable-key", order_controller_1.getStripePublishableKey);
orderRouter.post("/payment", auth_1.isAuth, order_controller_1.newPayment);
exports.default = orderRouter;
