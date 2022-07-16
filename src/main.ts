import Koa from "koa";
import { useLog } from "@/middleware/time-log";
import { useGlobalCatch } from "@/middleware/error-catch";
import { useFormatResponse } from "@/middleware/response";
import { useRoutes, useAllowedMethods } from "@/middleware/router";
import { useStatic } from "@/middleware/static";
import { getIp } from "@/util/ip";
import { initScheduleJobs } from "@/schedule";
import { initMongoose } from "@/mongodb";
import { createLogger } from "@/middleware/logger";
import koaBody from "koa-body";
const logger = createLogger();

const app = new Koa();

app
  .use(useGlobalCatch())
  .use(useLog())
  .use(koaBody())
  .use(useFormatResponse())
  .use(useRoutes())
  .use(useAllowedMethods())
  .use(useStatic());

app.listen(3000, async () => {
  const ip = getIp();
  logger.info(`serve started in http://${ip}:3000`);
  console.log(`serve started in http://${ip}:3000`);
  await initMongoose();
  initScheduleJobs();
});
