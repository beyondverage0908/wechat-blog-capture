import schedule from "node-schedule";
import { getHq } from "./hq";
import { createLogger } from "@/middleware/logger";
const logger = createLogger("EastmoneyLog");

const hqEstmoneyJob = () => {
  schedule.scheduleJob("0 0 15 * * 1-5", async () => {
    const hqList = await getHq();
    logger.mark("获取了行情数据");
    console.log(JSON.stringify(hqList));
  });
};

export const initEastmoneyJob = () => {
  hqEstmoneyJob();
};
