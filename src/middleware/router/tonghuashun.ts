import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { startCapture, thsCaptch } from "@/works/tonghuashun/tool";
import {
  saveLiangJiaData,
  queryLiangJia,
  saveTargetLiangjia,
  getLiangJiaTarget,
  updateLiangJiaTargetMonit,
  updateLiangJiaTargetMonitPrice,
} from "@/mongodb/tonghuashun/liangjia";
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
// 热门赛道量价齐跌
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
// 热门赛道量价齐升
router.get("/hotljqs", async (ctx) => {
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
  const data = await queryLiangJia(liangjiaDateRange, jcgsDateRange, Number(seriesDay), THSCaptchTypeEnum.ljqs);
  ctx.success({
    total: data.length,
    data: data,
  });
});
// 触发分析量价关系，并入库结果表
router.post("/ljtarget", async (ctx) => {
  const result = await saveTargetLiangjia();
  ctx.success(result);
});
// 获取量价关系
router.get("/ljtarget", async (ctx) => {
  const { monit }: { monit?: string } = ctx.request.query;
  const result = await getLiangJiaTarget({ monit });
  ctx.success({
    total: result.length || 0,
    data: result,
  });
});
// 更新量价关系结果表的监控状态
router.put("/ljtarget", async (ctx) => {
  const { id, monit } = ctx.request.body;
  if (!id || !monit) {
    ctx.error("id,monit参数必传");
    return;
  }
  const result = await updateLiangJiaTargetMonit(id, monit);
  if (result.matchedCount) {
    ctx.success("成功");
  } else {
    ctx.error("没有需要更新的数据");
  }
});
// 手动触发更新量价关系表中股票价格
router.put("/prices", async (ctx) => {
  const prices = await updateLiangJiaTargetMonitPrice(true);
  ctx.success(prices);
});

export default router;
