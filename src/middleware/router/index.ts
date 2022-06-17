import Router from "koa-router";
import home from "./home";
import page from "./page";
import wechat from "./wechat";

const router = new Router();

// 添加模块的路由
router.use("/home", home.routes(), home.allowedMethods());
router.use("/page", page.routes(), page.allowedMethods());
router.use("/wechat", wechat.routes(), wechat.allowedMethods());

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
