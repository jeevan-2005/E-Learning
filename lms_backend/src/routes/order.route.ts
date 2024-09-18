import express from "express";
import { createOrder } from "../controllers/order.controller";
import { isAuth } from "../middlewares/auth";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuth, createOrder);

export default orderRouter;
