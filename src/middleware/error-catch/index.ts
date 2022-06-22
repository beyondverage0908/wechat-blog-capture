import type { Context, Next } from "koa";

async function globalCatch(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error(`异常的请求：${ctx.url}`);
    console.error(error);
  }
}

export function useGlobalCatch() {
  return globalCatch;
}
