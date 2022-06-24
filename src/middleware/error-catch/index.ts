import type { Context, Next } from "koa";
import { createLogger } from "@/middleware/logger";

const logger = createLogger("ErrorCatch");

async function globalCatch(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    logger.error(`${ctx.method} ${ctx.url} ${ctx.status}`);
    logger.error(JSON.stringify(error));
  }
}

export function useGlobalCatch() {
  return globalCatch;
}
