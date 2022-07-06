import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getDailyAction } from "@/works/jiucaigongshe/hot";
import { updateTargetDayAction } from "@/works/jiucaigongshe";
import date from "@/lib/date";

const router = new Router<DefaultState, Context>();

router.get("/hot/:day", async (ctx) => {
  const { day } = ctx.params;
  const currentDay = date.format();
  const data = await getDailyAction(day || currentDay);
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

export default router;
