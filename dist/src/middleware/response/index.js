"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatResponse = void 0;
const status_1 = require("../../../constant/status");
function useFormatResponse() {
    return async (ctx, next) => {
        ctx.success = (data, code, message) => {
            ctx.body = {
                data,
                message: message || status_1.StatusTypes.COMMON_SUCCESS_MSG,
                code: code || status_1.StatusTypes.COMMON_SUCCESS_CODE,
            };
        };
        ctx.error = (message, code, url) => {
            ctx.body = {
                message: message || status_1.StatusTypes.COMMON_FAIL_MSG,
                code: code || status_1.StatusTypes.COMMON_FAIL_CODE,
                url: url || ctx.request.url,
            };
        };
        await next();
    };
}
exports.useFormatResponse = useFormatResponse;
