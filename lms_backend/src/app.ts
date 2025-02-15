require("dotenv").config();
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.routes";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.routes";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";

export const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie-parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: "https://e-learning-lms-ten.vercel.app",
    credentials: true,
  })
);

// api request rate-limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})


// user Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/layout", layoutRouter);

// health-check test api...
app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Health-Check : server is running fine.",
  });
});

// in no route exists
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} is not found.`) as any;
  err.statusCode = 404;
  next(err);
});


app.use(limiter);

// using custom errorMiddleware
app.use(errorMiddleware);
