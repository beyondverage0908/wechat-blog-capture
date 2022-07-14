"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLog = void 0;
const logger_1 = require("../logger");
const logger = (0, logger_1.createLogger)("TimeLog");
async function log(ctx, next) {
    const now = Date.now();
    await next();
    const end = Date.now();
    logger.info(`${ctx.url} ${ctx.method} ${(end - now) / 1000}s`);
}
function useLog() {
    return log;
}
exports.useLog = useLog;
