import mongoose from "mongoose";
import { config } from "./env.js";

const DB_URI = config.MONGO_URI;

export const connectDB = async () => {
    try {
        if(!DB_URI) {
            console.warn("⚠️  MONGO_URI is not provided in env file - using fallback");
            // Use a fallback local connection or skip connection
            return;
        }

        await mongoose.connect(DB_URI, {
            // Add connection options for better error handling
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        })
        console.log("✅ DB connected successfully");
    } catch (error) {
        console.warn("⚠️  Could not connect to database:", error.message);
        console.warn("⚠️  The app will continue running without database connection");
        console.warn("⚠️  Some features may not work properly");
    }
}
