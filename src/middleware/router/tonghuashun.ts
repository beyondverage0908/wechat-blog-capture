import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { startCapture, thsCaptch } from "@/works/tonghuashun/tool";

const router = new Router<DefaultState, Context>();

router.get("/ljqd", async (ctx) => {
  const result = await startCapture(thsCaptch.ljqs.url, thsCaptch.ljqs.type);
  ctx.success(result);
});

export default router;
