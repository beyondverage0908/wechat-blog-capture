import mongoose from "mongoose";
import { createLogger } from "@/middleware/logger";
import { DBConfig } from "./config";

const logger = createLogger("MongoDB-Log");

export async function initMongoose() {
  await mongoose.connect(
    `mongodb://127.0.0.1:27017/${DBConfig.name}`,
    (error) => {
      if (!error) {
        logger.info("mongodb connect success!!");
        console.log("mongodb connect success!!");
      } else {
        logger.error("mongoose connect error");
        throw error;
      }
    }
  );

  // 当连接断开时
  mongoose.connection.on("disconnected", function () {
    logger.error("mongoose disconnected");
  });

  mongoose.connection.on("reconnectFailed", () => {
    logger.error("mongoose reconnectFailed");
  });
}
