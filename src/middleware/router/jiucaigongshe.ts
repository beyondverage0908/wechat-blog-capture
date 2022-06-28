import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getMainPage } from "@/works/jiucaigongshe/hot";

const router = new Router<DefaultState, Context>();

router.get("/hot", async (ctx) => {
  await getMainPage();
  ctx.success();
});

export default router;
