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
// 获取当日数据
router.get("/today", async (ctx) => {
  const today = date.format();
  const isSuccess = await updateTargetDayAction(today);
  if (isSuccess === false) {
    ctx.error("触发爬取失败");
  } else {
    ctx.success("触发爬取成功");
  }
});
/**
 * 获取指定范围的异动数据
 */
router.get("/action", async (ctx) => {
  const { startDate, endDate } = ctx.query;
  if (!startDate || !endDate) {
    ctx.error("时间范围必填");
    return;
  }
  // 查询数据库中的数据
  const dateRange = date.range(startDate as string, endDate as string);
  const result = await queryActionOfRange(dateRange);
  // 对原始数据进行范围内的求和处理
  const map = new Map();
  result.forEach((item) => {
    const hasCategory = map.has(item.category);
    if (!hasCategory) {
      map.set(item.category, item);
    } else {
      const preItem = map.get(item.category);
      preItem.number += item.number;
      preItem.stocks = preItem.stocks.concat(item.stocks);
    }
  });
  // 倒序排列指定时间范围内的数据
  const sortArray = Array.from(map.values()).sort(
    (a, b) => b.number - a.number
  );
  ctx.success(sortArray);
});

export default router;
