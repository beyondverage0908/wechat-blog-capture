import type { Context, Next } from "koa";
import {
  COMMON_SUCCESS_CODE,
  COMMON_FAIL_CODE,
  COMMON_SUCCESS_MSG,
  COMMON_FAIL_MSG,
} from "@/constant/status";
import { Dictionary } from "@/types";

async function formatResponse(ctx: Context, next: Next) {
  ctx.success = (data: Dictionary, code?: string, message?: string) => {
    ctx.body = {
      data,
      message: message || COMMON_SUCCESS_MSG,
      code: code || COMMON_SUCCESS_CODE,
    };
  };
  ctx.fail = (code?: string, message?: string) => {
    ctx.body = {
      message: message || COMMON_FAIL_MSG,
      code: code || COMMON_FAIL_CODE,
    };
  };
  await next();
}

export function useFormatResponse() {
  return formatResponse;
}
