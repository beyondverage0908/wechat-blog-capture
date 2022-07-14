import schedule from "node-schedule";
import { getHq } from "./hq";
import { saveHqData } from "@/mongodb/eastmoney/hangqing";
import DateTool from "@/lib/date";

const hqEstmoneyJob = () => {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [1, 2, 3, 4, 5];
  rule.hour = [9, 10, 11, 13, 14];
  rule.second = 30;
  schedule.scheduleJob(rule, async () => {
    const today = DateTool.format();
    const hqList = await getHq();
    saveHqData(hqList, today);
  });
};

export const initEastmoneyJob = () => {
  hqEstmoneyJob();
};
