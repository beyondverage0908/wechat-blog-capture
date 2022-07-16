import { DefaultState, Context } from "koa";
import Router from "koa-router";
import home from "./home";
import page from "./page";
import wechat from "./wechat";
import eastmoney from "./eastmoney";
import jiucaigongshe from "./jiucaigongshe";
import ticket from "./ticket";

const router = new Router<DefaultState, Context>({ prefix: "/pac/api" });

// 添加模块的路由
router.use("/home", home.routes(), home.allowedMethods());
router.use("/page", page.routes(), page.allowedMethods());
router.use("/wechat", wechat.routes(), wechat.allowedMethods());
router.use("/eastmoney", eastmoney.routes(), eastmoney.allowedMethods());
router.use(
  "/jiucaigongshe",
  jiucaigongshe.routes(),
  jiucaigongshe.allowedMethods()
);
router.use("/ticket", ticket.routes(), ticket.allowedMethods());

// 首页
router.get("/", (ctx) => {
  ctx.body = "welcome to here!!";
});

function useRoutes() {
  return router.routes();
}
function useAllowedMethods() {
  return router.allowedMethods();
}

export { useRoutes, useAllowedMethods };
