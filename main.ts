import Koa from "koa";
import { useLog } from "@/middleware/time-log";
import { useGlobalCatch } from "@/middleware/error-catch";
import { useFormatResponse } from "@/middleware/response";
import { useRoutes, useAllowedMethods } from "@/middleware/router";
import { getIp } from "@/util/ip";

const app = new Koa();

app
  .use(useGlobalCatch())
  .use(useLog())
  .use(useFormatResponse())
  .use(useRoutes())
  .use(useAllowedMethods());

app.listen(3000, () => {
  const ip = getIp();
  console.log(`serve started in http://${ip}:3000`);
});
