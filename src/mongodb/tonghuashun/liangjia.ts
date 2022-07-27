/**
 * 量价关系
 */

import mongoose from "mongoose";
import { createLogger } from "@/middleware/logger";
import { t_ths_liangjia } from "../model";
import { LiangJiaSchema } from "../schema/tonghuashun";
import { LiangJiaStock } from "@/works/tonghuashun/types";
const logger = createLogger("TongHuaShunDB");

export const saveLiangJiaData = async (stocks: LiangJiaStock[]) => {
  logger.info("开始插入同花顺数据");
  if (!stocks.length) {
    logger.info("无数据，不需要插入");
    return;
  }
  const item = stocks[0];
  const Model = mongoose.model(t_ths_liangjia, LiangJiaSchema);
  const count = await Model.find({ date: item.date, type: item.type }).count();
  if (count > 0) {
    logger.info("已经存在当日的数据，不需要插入");
    return;
  }
  await Model.insertMany(stocks);
  logger.info("结束插入同花顺数据");
};
