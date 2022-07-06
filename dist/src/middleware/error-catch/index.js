"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalCatch = void 0;
const logger_1 = require("../../../middleware/logger");
const logger = (0, logger_1.createLogger)("ErrorCatch");
async function globalCatch(ctx, next) {
    try {
        await next();
    }
    catch (error) {
        logger.error(`${ctx.method} ${ctx.url} ${ctx.status}`);
        logger.error(JSON.stringify(error));
        console.error(error);
        ctx.error("服务器异常", 500);
    }
}
function useGlobalCatch() {
    return globalCatch;
}
exports.useGlobalCatch = useGlobalCatch;
