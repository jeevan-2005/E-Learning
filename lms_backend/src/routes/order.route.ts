import express from "express";
import {
  createOrder,
  getAllOrders,
  getStripePublishableKey,
  newPayment,
} from "../controllers/order.controller";
import { authorizeRoles, isAuth } from "../middlewares/auth";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", updateAccessToken, isAuth, createOrder);
orderRouter.get(
  "/get-all-orders",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  getAllOrders
);
orderRouter.get("/payment/stripe-publishable-key", getStripePublishableKey);
orderRouter.post("/payment", isAuth, newPayment);

export default orderRouter;
