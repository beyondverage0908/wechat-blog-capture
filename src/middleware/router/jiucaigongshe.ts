import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getDailyAction } from "@/works/jiucaigongshe/hot";
import { updateTargetDayAction } from "@/works/jiucaigongshe";
import { queryActionOfRange, updateHot } from "@/mongodb/jiucaigongshe/action";
import HotTag from "@/mongodb/jiucaigongshe/hot-tag";
import date from "@/lib/date";
import JcgsStock from "@/mongodb/jiucaigongshe/detail";

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
  const { recentDay, startDate, endDate } = ctx.query;
  if (!recentDay && !startDate && !endDate) {
    ctx.error("时间范围必填");
    return;
  }
  console.log(recentDay, startDate, endDate);
  // 查询数据库中的数据
  let dateRange = date.range(startDate as string, endDate as string);
  if (Number(recentDay)) {
    dateRange = date.recentRange(Number(recentDay));
  }
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
  const sortArray = Array.from(map.values()).sort((a, b) => b.number - a.number);
  ctx.success(sortArray);
});
/**
 * 获取指定天数的热门标签
 */
router.get("/hots/tag", async (ctx) => {
  const { recentDay } = ctx.request.query;
  if (!recentDay) {
    ctx.error("recentDay参数传");
    return;
  }
  const tradeDays = date.recentRange(Number(recentDay));
  const hotTag = new HotTag();
  const hots = await hotTag.getHotTag(tradeDays);
  ctx.success(hots);
});
/**
 * 保存，并推送热门标签
 */
router.post("/hots/tag", async (ctx) => {
  const { tags } = ctx.request.body;
  if (!tags) {
    ctx.error("标签不能为空");
    return;
  }
  console.log(tags);
  const hotTag = new HotTag();
  const result = await hotTag.saveHotTag(tags);
  if (result && result.length) {
    ctx.success("保存成功");
  } else {
    ctx.error("保存失败");
  }
});
/**
 * 获取选中的热门标签
 */
router.get("/hots/tag/checked", async (ctx) => {
  const hotTag = new HotTag();
  const hots = await hotTag.getCheckedHotTags();
  ctx.success(hots);
});

router.get("/stock/detail", async (ctx) => {
  const { code } = ctx.request.query;
  if (!code) {
    ctx.error("没有证券代码");
    return;
  }
  const stock = new JcgsStock();
  ctx.success(await stock.getDetail(code as string));
});

export default router;
