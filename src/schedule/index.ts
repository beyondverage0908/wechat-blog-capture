import Koa from "koa";
import { initEastmoneyJob } from "@/works/eastmoney/index";
import { initJiuCaiGongSheJob } from "@/works/jiucaigongshe";
import { createLogger } from "@/middleware/logger";
const logger = createLogger();

// 初始化定时任务
export const initScheduleJobs = () => {
  try {
    initEastmoneyJob();
    initJiuCaiGongSheJob();
  } catch (error) {
    logger.error(JSON.stringify(error));
  }
};
