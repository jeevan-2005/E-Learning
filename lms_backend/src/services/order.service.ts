import { NextFunction, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import OrderModel from "../models/order.model";

const newOrder = catchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  }
);

export default newOrder;
