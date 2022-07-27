import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { startCapture, thsCaptch } from "@/works/tonghuashun/tool";
import { saveLiangJiaData } from "@/mongodb/tonghuashun/liangjia";

const router = new Router<DefaultState, Context>();

router.get("/ljqd", async (ctx) => {
  console.log("ljqd");
  const result = await startCapture(thsCaptch.ljqd.url, thsCaptch.ljqd.type);
  await saveLiangJiaData(result);
  ctx.success(result);
});
router.get("/ljqs", async (ctx) => {
  console.log("ljqs");
  const result = await startCapture(thsCaptch.ljqs.url, thsCaptch.ljqs.type);
  await saveLiangJiaData(result);
  ctx.success(result);
});

export default router;
