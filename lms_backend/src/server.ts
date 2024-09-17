require("dotenv").config();
import { app } from "./app";
import connectDB from "./config/db";
import { v2 as cloudinary } from "cloudinary";

const port = process.env.PORT;



app.listen(port, () => {
  console.log(`Server is connected with port ${port}`);
  connectDB();
});
