import type { Context, Next } from "koa";
import { StatusTypes } from "@/constant/status";
import { Dictionary } from "@/types";

export function useFormatResponse() {
  return async (ctx: Context, next: Next) => {
    ctx.success = (
      data?: Dictionary | string,
      code?: string,
      message?: string
    ) => {
      ctx.body = {
        data,
        message: message || StatusTypes.COMMON_SUCCESS_MSG,
        code: code || StatusTypes.COMMON_SUCCESS_CODE,
      };
    };
    ctx.fail = (code?: string, message?: string) => {
      ctx.body = {
        message: message || StatusTypes.COMMON_FAIL_MSG,
        code: code || StatusTypes.COMMON_FAIL_CODE,
      };
    };
    await next();
  };
}
