import { initEastmoneyJob } from "@/works/eastmoney/index";
import { initJiuCaiGongSheJob } from "@/works/jiucaigongshe";

// 初始化定时任务
export const initScheduleJobs = () => {
  initEastmoneyJob();
  initJiuCaiGongSheJob();
};
