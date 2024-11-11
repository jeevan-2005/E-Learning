"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const layout_model_1 = require("../models/layout.model");
const createLayout = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (!type) {
            return next(new ErrorHandler_1.default("Please provide type", 400));
        }
        const isTypeExists = await layout_model_1.LayoutModel.findOne({
            type,
        });
        if (isTypeExists) {
            return next(new ErrorHandler_1.default(`${type} already exists`, 400));
        }
        if (type == "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
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
            await layout_model_1.LayoutModel.create({
                type,
                banner,
            });
        }
        if (type == "FAQ") {
            const { faq } = req.body;
            await layout_model_1.LayoutModel.create({
                type,
                faq,
            });
        }
        if (type == "Categories") {
            const { categories } = req.body;
            await layout_model_1.LayoutModel.create({
                type,
                categories,
            });
        }
        return res.status(201).json({
            success: true,
            message: "Layout created successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.createLayout = createLayout;
const editLayout = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (!type) {
            return next(new ErrorHandler_1.default("Please provide type", 400));
        }
        const isTypeExists = await layout_model_1.LayoutModel.findOne({
            type,
        });
        if (!isTypeExists) {
            return next(new ErrorHandler_1.default(`${type} not found`, 404));
        }
        if (type == "Banner") {
            const { image, title, subTitle } = req.body;
            // console.log(image);
            const imageData = image.startsWith("https://res.cloudinary.com")
                ? isTypeExists.banner.image
                : await cloudinary_1.default.v2.uploader.upload(image, {
                    folder: "layout",
                });
            const banner = {
                image: {
                    public_id: imageData.public_id,
                    url: image.startsWith("https://res.cloudinary.com")
                        ? imageData.url
                        : imageData.secure_url,
                },
                title,
                subTitle,
            };
            await layout_model_1.LayoutModel.findByIdAndUpdate(isTypeExists._id, {
                type,
                banner,
            });
        }
        if (type == "FAQ") {
            const { faq } = req.body;
            await layout_model_1.LayoutModel.findByIdAndUpdate(isTypeExists._id, {
                type,
                faq,
            });
        }
        if (type == "Categories") {
            const { categories } = req.body;
            await layout_model_1.LayoutModel.findByIdAndUpdate(isTypeExists._id, {
                type,
                categories,
            });
        }
        return res.status(201).json({
            success: true,
            message: "Layout updated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.editLayout = editLayout;
const getLayoutByType = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { type } = req.params;
        if (!type) {
            return next(new ErrorHandler_1.default("Please provide type", 400));
        }
        const layout = await layout_model_1.LayoutModel.findOne({ type });
        if (!layout) {
            return next(new ErrorHandler_1.default(`${type} not found`, 404));
        }
        return res.status(200).json({
            success: true,
            layout,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getLayoutByType = getLayoutByType;
