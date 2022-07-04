import mongoose from "mongoose";
import { createLogger } from "@/middleware/logger";
import { DBConfig } from "./config";

const logger = createLogger("MongoDB-Log");

export async function initMongoose() {
  try {
    type EnvType = "development" | "production";
    const env = (process.env.NODE_ENV as EnvType) || "development";
    const config = DBConfig[env];
    const mongoOption =
      env === "development"
        ? {
            minPoolSize: 3,
            maxPoolSize: 10,
          }
        : {
            authSource: config.authSource,
            user: config.user,
            pass: config.pwd,
            minPoolSize: 3,
            maxPoolSize: 10,
          };
    const mongo = await mongoose.connect(
      `mongodb://127.0.0.1:27017/${config.name}`,
      mongoOption
    );
    const db = mongo.connection;
    db.on("connection", () => {
      console.log("mongoose connection");
    });
    // 当连接断开时
    db.on("disconnected", function () {
      logger.error("mongoose disconnected");
    });
    db.on("reconnectFailed", () => {
      logger.error("mongoose reconnectFailed");
    });
    return db;
  } catch (error) {
    console.error(error);
  }
}
