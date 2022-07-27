"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const time_log_1 = require("./middleware/time-log");
const error_catch_1 = require("./middleware/error-catch");
const response_1 = require("./middleware/response");
const router_1 = require("./middleware/router");
const static_1 = require("./middleware/static");
const compression_1 = require("./middleware/compression");
const ip_1 = require("./util/ip");
const schedule_1 = require("./schedule");
const mongodb_1 = require("./mongodb");
const logger_1 = require("./middleware/logger");
const koa_body_1 = __importDefault(require("koa-body"));
const logger = (0, logger_1.createLogger)();
const app = new koa_1.default();
app
    .use((0, error_catch_1.useGlobalCatch)())
    .use((0, time_log_1.useLog)())
    .use((0, compression_1.useCompress)())
    .use((0, koa_body_1.default)())
    .use((0, response_1.useFormatResponse)())
    .use((0, router_1.useRoutes)())
    .use((0, router_1.useAllowedMethods)())
    .use((0, static_1.useStatic)());
app.listen(3000, async () => {
    const ip = (0, ip_1.getIp)();
    logger.info(`serve started in http://${ip}:3000`);
    console.log(`serve started in http://${ip}:3000`);
    await (0, mongodb_1.initMongoose)();
    (0, schedule_1.initScheduleJobs)();
});
