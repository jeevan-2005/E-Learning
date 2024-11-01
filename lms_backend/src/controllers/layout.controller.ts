import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import cloudinary, { UploadApiResponse } from "cloudinary";
import { LayoutModel } from "../models/layout.model";

const createLayout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (!type) {
        return next(new ErrorHandler("Please provide type", 400));
      }

      const isTypeExists = await LayoutModel.findOne({
        type,
      });
      if (isTypeExists) {
        return next(new ErrorHandler(`${type} already exists`, 400));
      }

      if (type == "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create({
          type,
          banner,
        });
      }

      if (type == "FAQ") {
        const { faq } = req.body;
        await LayoutModel.create({
          type,
          faq,
        });
      }

      if (type == "Categories") {
        const { categories } = req.body;
        await LayoutModel.create({
          type,
          categories,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const editLayout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (!type) {
        return next(new ErrorHandler("Please provide type", 400));
      }

      const isTypeExists = await LayoutModel.findOne({
        type,
      });
      if (!isTypeExists) {
        return next(new ErrorHandler(`${type} not found`, 404));
      }

      if (type == "Banner") {
        const { image, title, subTitle } = req.body;
        // console.log(image);
        const imageData = image.startsWith("https://res.cloudinary.com")
          ? isTypeExists.banner.image
          : await cloudinary.v2.uploader.upload(image, {
              folder: "layout",
            });

        const banner = {
          image: {
            public_id: imageData.public_id,
            url: image.startsWith("https://res.cloudinary.com")
              ? imageData.url
              : (imageData as UploadApiResponse).secure_url,
          },
          title,
          subTitle,
        };

        await LayoutModel.findByIdAndUpdate(isTypeExists._id, {
          type,
          banner,
        });
      }

      if (type == "FAQ") {
        const { faq } = req.body;
        await LayoutModel.findByIdAndUpdate(isTypeExists._id, {
          type,
          faq,
        });
      }

      if (type == "Categories") {
        const { categories } = req.body;
        await LayoutModel.findByIdAndUpdate(isTypeExists._id, {
          type,
          categories,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const getLayoutByType = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      if (!type) {
        return next(new ErrorHandler("Please provide type", 400));
      }
      const layout = await LayoutModel.findOne({ type });
      if (!layout) {
        return next(new ErrorHandler(`${type} not found`, 404));
      }

      return res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export { createLayout, editLayout, getLayoutByType };
