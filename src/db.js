import mongoose from "mongoose";
import { config } from "./config/env.js";

const DB_URI = config.MONGO_URI;

export const connectDB = async () => {
    try {
        if(!DB_URI) throw new Error("MONGO_URI is not provided in env file");

        await mongoose.connect(DB_URI, {})
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}
