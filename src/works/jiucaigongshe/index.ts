import dayjs from "dayjs";
import mongoose from "mongoose";
import schedule from "node-schedule";
import { getDailyAction } from "./hot";
import { insertHot, updateHot } from "@/mongodb/actions/jiucaigongshe";
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
/**
 * 定时任务触发爬取每日数据
 */
async function scheduleforEveryDayAction() {
  const rule = new schedule.RecurrenceRule();
  rule.second = 0;
  rule.minute = 35;
  rule.hour = [12, 15];
  rule.dayOfWeek = [1, 2, 3, 4, 5];
  schedule.scheduleJob(rule, async () => {
    const date = dayjs().format("YYYY-MM-DD");
    logger.info(`定时任务开始抓取${date}数据`);
    await updateTargetDayAction(date);
    logger.info(`定时任务抓取了${date}的数据-结束`);
  });
}
/**
 * 更新某日的数据（没有则插入，有则先删除后插入）
 * @param day
 */
export async function updateTargetDayAction(day: string): Promise<boolean> {
  logger.info(`触发任务开始抓取${day}数据`);
  const data = await getDailyAction(day);
  if (data.success === false) {
    return false;
  }
  const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
  const count = await CategoryModel.find({ day: day }).count();
  if (count) {
    const result = await updateHot(data.categorys, data.day!);
    logger.info(`触发任务抓取了${data.day}的数据-更新-结束`);
    return result;
  } else {
    const result = await insertHot(data.categorys, data.day!);
    logger.info(`触发任务抓取了${data.day}的数据-新增-结束`);
    return result;
  }
}

export function initJiuCaiGongSheJob() {
  // getLast60DayActionData();
  scheduleforEveryDayAction();
}
