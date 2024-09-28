import express from "express";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { authorizeRoles, isAuth } from "../middlewares/auth";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuth, createOrder);
orderRouter.get(
  "/get-all-orders",
  isAuth,
  authorizeRoles("admin"),
  getAllOrders
);

export default orderRouter;
