require("dotenv").config();
import { app } from "./app";
import connectDB from "./config/db";
import { v2 as cloudinary } from "cloudinary";

const port = process.env.PORT;

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

app.listen(port, () => {
  console.log(`Server is connected with port ${port}`);
  connectDB();
});
