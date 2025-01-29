require("dotenv").config();
import http from "http";
import { app } from "./app";
import connectDB from "./config/db";
import { v2 as cloudinary } from "cloudinary";
import { initSocketServer } from "./socketServer";

const port = process.env.PORT;

const server = http.createServer(app);

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

initSocketServer(server);

server.listen(port, () => {
  console.log(`Server is connected with port ${port}`);
  connectDB();
});
