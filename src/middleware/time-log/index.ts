import Koa from "koa";

import { createLogger } from "@/middleware/logger";
const logger = createLogger("TimeLog");

async function log(ctx: Koa.Context, next: Koa.Next) {
  const now = Date.now();
  await next();
  const end = Date.now();
  logger.info(`${ctx.url} ${ctx.method} ${(end - now) / 1000}s`);
}

export function useLog() {
  return log;
}
