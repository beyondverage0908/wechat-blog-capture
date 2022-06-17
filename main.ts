import Koa from "koa";
import { useRoutes, useAllowedMethods } from "@/middleware/router";

const app = new Koa();

app.use(useRoutes()).use(useAllowedMethods());

app.listen(3000, () => {
  console.log("serve started in http://localhost:3000");
});
