import Koa from "koa";
import { useRoutes, useAllowedMethods } from "@/middleware/router";
import { getIp } from "@/util/ip";

const app = new Koa();

app.use(useRoutes()).use(useAllowedMethods());

app.listen(3000, () => {
  const ip = getIp();
  console.log(`serve started in http://${ip}:3000`);
});
