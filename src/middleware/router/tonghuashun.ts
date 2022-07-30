import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { startCapture, thsCaptch } from "@/works/tonghuashun/tool";
import { saveLiangJiaData, queryLiangJia } from "@/mongodb/tonghuashun/liangjia";
import { THSCaptchTypeEnum } from "@/types/tonghuashun";
import dateTool from "@/lib/date";

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
  const { liangjiaDays, jcgsDays } = ctx.query;
  if (!liangjiaDays || !jcgsDays) {
    ctx.error("liangjiaDays, jcgsDays参数未传，无法查询");
    return;
  }
  const liangjiaDateRange = dateTool.recentRange(2);
  const jcgsDateRange = dateTool.recentRange(4);
  const data = await queryLiangJia(liangjiaDateRange, jcgsDateRange, THSCaptchTypeEnum.ljqd);
  ctx.success({
    total: data.length,
    data: data,
  });
});

export default router;
