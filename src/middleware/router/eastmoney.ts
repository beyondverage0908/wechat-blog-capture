import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getHq } from "@/works/eastmoney/hq";

const router = new Router<DefaultState, Context>();

router.get("/hq", async (ctx) => {
  const hqList = await getHq();
  ctx.success(hqList);
});

export default router;
