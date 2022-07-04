"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMongoose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../middleware/logger");
const config_1 = require("./config");
const logger = (0, logger_1.createLogger)("MongoDB-Log");
async function initMongoose() {
    try {
        const env = process.env.NODE_ENV;
        const config = config_1.DBConfig[env];
        const mongoOption = env === "development"
            ? {
                minPoolSize: 3,
                maxPoolSize: 10,
            }
            : {
                authSource: config.authSource,
                user: config.name,
                pass: config.pwd,
                minPoolSize: 3,
                maxPoolSize: 10,
            };
        const mongo = await mongoose_1.default.connect(`mongodb://127.0.0.1:27017/${config.name}`, mongoOption);
        const db = mongo.connection;
        db.on("connection", () => {
            console.log("mongoose connection");
        });
        db.on("disconnected", function () {
            logger.error("mongoose disconnected");
        });
        db.on("reconnectFailed", () => {
            logger.error("mongoose reconnectFailed");
        });
        return db;
    }
    catch (error) {
        console.error(error);
    }
}
exports.initMongoose = initMongoose;
