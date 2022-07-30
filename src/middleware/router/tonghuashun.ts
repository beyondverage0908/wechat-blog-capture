import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { startCapture, thsCaptch } from "@/works/tonghuashun/tool";
import { saveLiangJiaData, queryLiangJia } from "@/mongodb/tonghuashun/liangjia";
import { THSCaptchTypeEnum } from "@/types/tonghuashun";
import dateTool from "@/lib/date";
import { createLogger } from "@/logger";
const logger = createLogger("LiangJiaFenXi");

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
  const { recentLiangjiaDay, recentJcgsDay, seriesDay = 2 } = ctx.query;
  if (!recentLiangjiaDay || !recentJcgsDay) {
    ctx.error("recentLiangjiaDay, recentJcgsDay参数未传，无法查询");
    return;
  }
  const liangjiaDateRange = dateTool.recentRange(Number(recentLiangjiaDay));
  const jcgsDateRange = dateTool.recentRange(Number(recentJcgsDay));
  logger.info(
    JSON.stringify(
      `量价分析 recentLiangjiaDay${JSON.stringify(liangjiaDateRange)} recentJcgsDay${JSON.stringify(
        jcgsDateRange
      )} seriesDay: ${seriesDay}`
    )
  );
  const data = await queryLiangJia(liangjiaDateRange, jcgsDateRange, Number(seriesDay), THSCaptchTypeEnum.ljqd);
  ctx.success({
    total: data.length,
    data: data,
  });
});

export default router;
