import mongoose from "mongoose";
export const connectDB = async () => {

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }

};

