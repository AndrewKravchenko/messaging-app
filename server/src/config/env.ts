import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/messaging-app',
  WS_PORT: Number(process.env.WS_PORT || 5001),
};
