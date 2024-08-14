import mongoose from 'mongoose';
require("dotenv").config();

const URI = process.env.MONGO_URI || '';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
