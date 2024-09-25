import { app } from "./app";
require('dotenv').config();
import http from 'http';
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import { initSocketIOServer } from "../socketServer";
const server = http.createServer(app)

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

initSocketIOServer(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});