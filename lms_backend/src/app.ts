require("dotenv").config();
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.routes";

export const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie-parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);



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

// using custom errorMiddleware
app.use(errorMiddleware);
