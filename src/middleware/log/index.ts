import Koa from "koa";

async function log(ctx: Koa.Context, next: Koa.Next) {
  const now = Date.now();
  await next();
  const end = Date.now();
  console.log(`发起一个请求: ${ctx.url}，耗时：${(end - now) / 1000}s`);
}

export function useLog() {
  return log;
}
