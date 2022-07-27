import schedule from "node-schedule";
import { startCapture, thsCaptch } from "./tool";
import { saveLiangJiaData } from "@/mongodb/tonghuashun/liangjia";

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
  rule.minute = 45;
  rule.hour = [12, 15];
  rule.dayOfWeek = [1, 2, 3, 4, 5];
  schedule.scheduleJob(rule, async () => {
    const result = await startCapture(thsCaptch.ljqs.url, thsCaptch.ljqs.type);
    await saveLiangJiaData(result);
  });
}

export const initTongHuaShunSchedule = () => {
  scheduleforLjqd();
  scheduleforLjqs();
};
