import { DefaultState, Context } from "koa";
import Router from "koa-router";

// 子路由2
let page = new Router<DefaultState, Context>();
page
  .get("/404", async (ctx) => {
    ctx.body = "404 page!";
  })
  .get("/helloworld", async (ctx) => {
    ctx.body = "helloworld page!";
  });

export default page;
