import Koa from "koa";
import { useLog } from "@/middleware/time-log";
import { useGlobalCatch } from "@/middleware/error-catch";
import { useFormatResponse } from "@/middleware/response";
import { useRoutes, useAllowedMethods } from "@/middleware/router";
import { getIp } from "@/util/ip";
import { initScheduleJobs } from "@/schedule";
import { initMongoose } from "@/mongodb";
import { createLogger } from "@/middleware/logger";
const logger = createLogger();

const app = new Koa();

app
  .use(useGlobalCatch())
  .use(useLog())
  .use(useFormatResponse())
  .use(useRoutes())
  .use(useAllowedMethods());

app.listen(3000, async () => {
  const ip = getIp();
  logger.info(`serve started in http://${ip}:3000`);
  await initMongoose();
  initScheduleJobs();
});
