// src/config/env.js
import { configDotenv } from "dotenv";
configDotenv();

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  SESSION_SECRET: process.env.SESSION_SECRET_KEY || 'your-secret-key-here',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};

// Validation of critical variables
if (!config.MONGO_URI) {
  console.warn('⚠️  MONGO_URI no está definida en el archivo .env');
}

if (!process.env.SESSION_SECRET_KEY) {
  console.warn('⚠️  SESSION_SECRET no está definida en el archivo .env - usando valor por defecto');
}

if (!config.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET no está definida en el archivo .env');
}
