import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getDailyAction } from "@/works/jiucaigongshe/hot";
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

export default router;
