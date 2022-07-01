import type { Context, Next } from "koa";
import { StatusTypes } from "@/constant/status";

export function useFormatResponse() {
  return async (ctx: Context, next: Next) => {
    ctx.success = (data, code, message) => {
      ctx.body = {
        data,
        message: message || StatusTypes.COMMON_SUCCESS_MSG,
        code: code || StatusTypes.COMMON_SUCCESS_CODE,
      };
    };
    ctx.error = (message, code, url) => {
      ctx.body = {
        message: message || StatusTypes.COMMON_FAIL_MSG,
        code: code || StatusTypes.COMMON_FAIL_CODE,
        url: url || ctx.request.url,
      };
    };
    await next();
  };
}
