import { NextFunction, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import OrderModel from "../models/order.model";

export const newOrder = catchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  }
);

// get all orders
export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    orders,
  });
};
