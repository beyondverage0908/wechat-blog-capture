import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getDailyAction } from "@/works/jiucaigongshe/hot";
import { updateTargetDayAction } from "@/works/jiucaigongshe";
import { queryActionOfRange, updateHot } from "@/mongodb/jiucaigongshe/action";
import date from "@/lib/date";

const router = new Router<DefaultState, Context>();

router.get("/hot/:day", async (ctx) => {
  const { day } = ctx.params;
  const currentDay = date.format();
  const data = await getDailyAction(day || currentDay);
  await updateHot(data.categorys, data.day!);
  if (data.success === false) {
    ctx.error(data.message);
  } else {
    ctx.success(data);
  }
});
router.get("/today", async (ctx) => {
  const today = date.format();
  const isSuccess = await updateTargetDayAction(today);
  if (isSuccess === false) {
    ctx.error("触发爬取失败");
  } else {
    ctx.success("触发爬取成功");
  }
});
router.get("/action", async (ctx) => {
  const { startDate, endDate } = ctx.query;
  if (!startDate || !endDate) {
    ctx.error("时间范围必填");
    return;
  }
  const dateRange = date.range(startDate as string, endDate as string);
  const result = await queryActionOfRange(dateRange);
  ctx.success(result);
});

export default router;
