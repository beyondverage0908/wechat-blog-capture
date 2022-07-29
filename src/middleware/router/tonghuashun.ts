import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { startCapture, thsCaptch } from "@/works/tonghuashun/tool";
import { saveLiangJiaData, queryLiangJia } from "@/mongodb/tonghuashun/liangjia";
import { THSCaptchTypeEnum } from "@/types/tonghuashun";
import dayjs from "dayjs";

const router = new Router<DefaultState, Context>();

// 触发量价齐跌
router.get("/ljqd", async (ctx) => {
  console.log("ljqd");
  const result = await startCapture(thsCaptch.ljqd.url, thsCaptch.ljqd.type);
  await saveLiangJiaData(result);
  ctx.success(result);
});
// 触发量价齐升
router.get("/ljqs", async (ctx) => {
  console.log("ljqs");
  const result = await startCapture(thsCaptch.ljqs.url, thsCaptch.ljqs.type);
  await saveLiangJiaData(result);
  ctx.success(result);
});

router.get("/hotljqd", async (ctx) => {
  const date = dayjs().format("YYYY-MM-DD");
  const data = await queryLiangJia(date, THSCaptchTypeEnum.ljqd);
  ctx.success(data || {});
});

export default router;
