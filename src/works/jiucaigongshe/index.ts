import dayjs from "dayjs";
import mongoose from "mongoose";
import schedule from "node-schedule";
import { getDailyAction } from "./hot";
import { insertHot } from "@/mongodb/actions/jiucaigongshe";
import { t_jcgs_category } from "@/mongodb/model";
import { CategorySchema } from "@/mongodb/schema/jiucaigongshe/hot";
import { createLogger } from "@/middleware/logger";
const logger = createLogger("JiuCaiGongSheLog-Auto");

// 爬取最近60天的数据
async function getLast60DayActionData() {
  for await (const v of Array.from({ length: 60 }, (_, index) => index)) {
    const date = dayjs().subtract(v, "day").format("YYYY-MM-DD");
    const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
    const count = await CategoryModel.find({ day: date }).count();
    if (count) {
      logger.info(`自动化任务抓取${date}异动数据已经存在！`);
      continue;
    }
    const data = await getDailyAction(date);
    if (data.day) {
      await insertHot(data.categorys, data.day);
    }
  }
}
async function scheduleforEveryDayAction() {
  const rule = new schedule.RecurrenceRule();
  rule.second = 0;
  rule.minute = 45;
  rule.hour = 15;
  rule.dayOfWeek = [1, 2, 3, 4, 5, 6];
  schedule.scheduleJob(rule, async () => {
    const date = dayjs().format("YYYY-MM-DD");
    const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
    const count = await CategoryModel.find({ day: date }).count();
    if (count) {
      return;
    }
    const data = await getDailyAction(date);
    if (data.day) {
      logger.info(`定时任务抓取了${date}的数据`);
      await insertHot(data.categorys, data.day);
    }
  });
}

export function initJiuCaiGongSheJob() {
  // getLast60DayActionData();
  scheduleforEveryDayAction();
}
