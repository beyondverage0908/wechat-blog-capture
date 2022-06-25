import schedule from "node-schedule";
import dayjs from "dayjs";
import { getHq } from "./hq";

const hqEstmoneyJob = () => {
  schedule.scheduleJob("1 1 15 * * 1-5", async () => {
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    const hqList = await getHq();
    console.log(JSON.stringify(hqList));
  });
};

export const initEastmoneyJob = () => {
  hqEstmoneyJob();
};
