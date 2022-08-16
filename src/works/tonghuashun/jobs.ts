import schedule from "node-schedule";
import { startCapture, thsCaptch } from "./tool";
import {
  saveLiangJiaData,
  saveTargetLiangjia,
  updateLiangJiaTargetMonitPrice,
  updateLiangJiaTargetAfterDaysPrice,
} from "@/mongodb/tonghuashun/liangjia";

/**
 * 获取量价齐跌
 */
async function scheduleforLjqd() {
  const rule = new schedule.RecurrenceRule();
  rule.second = 0;
  rule.minute = 40;
  rule.hour = [12, 15];
  rule.dayOfWeek = [1, 2, 3, 4, 5];
  schedule.scheduleJob(rule, async () => {
    const result = await startCapture(thsCaptch.ljqd.url, thsCaptch.ljqd.type);
    await saveLiangJiaData(result);
  });
}
// 获取量价齐升
async function scheduleforLjqs() {
  const rule = new schedule.RecurrenceRule();
  rule.second = 0;
  rule.minute = 42;
  rule.hour = [12, 15];
  rule.dayOfWeek = [1, 2, 3, 4, 5];
  schedule.scheduleJob(rule, async () => {
    const result = await startCapture(thsCaptch.ljqs.url, thsCaptch.ljqs.type);
    await saveLiangJiaData(result);
  });
}
// 每个交易日定时计算出同花顺的量价齐升，量价齐跌和韭菜公社热点异动的股票入库
async function scheduleforSaveLiangjiaTarget() {
  const rule = new schedule.RecurrenceRule();
  rule.second = 0;
  rule.minute = 45;
  rule.hour = 15;
  rule.dayOfWeek = [1, 2, 3, 4, 5];
  schedule.scheduleJob(rule, async () => {
    await saveTargetLiangjia();
  });
}
// 爬取监控中的股票价格
async function scheduleforMonitPrice() {
  const rule = new schedule.RecurrenceRule();
  rule.second = 0;
  rule.minute = 48;
  rule.hour = 15;
  rule.dayOfWeek = [1, 2, 3, 4, 5];
  schedule.scheduleJob(rule, async () => {
    await updateLiangJiaTargetMonitPrice(true);
    await updateLiangJiaTargetAfterDaysPrice(7);
    await updateLiangJiaTargetAfterDaysPrice(14);
  });
}

export const initTongHuaShunSchedule = () => {
  scheduleforLjqd();
  scheduleforLjqs();
  scheduleforSaveLiangjiaTarget();
  scheduleforMonitPrice();
};
