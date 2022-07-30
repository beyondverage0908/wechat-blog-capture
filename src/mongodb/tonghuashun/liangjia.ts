/**
 * 量价关系
 */

import mongoose from "mongoose";
import { createLogger } from "@/middleware/logger";
import { t_ths_liangjia } from "../model";
import { LiangJiaSchema } from "../schema/tonghuashun";
import { LiangJiaStock, THSCaptchTypeEnum } from "@/types/tonghuashun";
import { queryRangeHotStocks } from "@/mongodb/jiucaigongshe/liangjia";
import { Stock } from "@/types/jiucaigongshe";
const logger = createLogger("TongHuaShunDB");

function mapLiangJiaStock(stock: LiangJiaStock): LiangJiaStock {
  return {
    name: stock.name,
    code: stock.code,
    price: stock.price,
    percent: stock.percent,
    overrate: stock.overrate,
    industry: stock.industry,
    days: stock.days,
    type: stock.type,
    date: stock.date,
  };
}

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

/**
 * 查询指定日期的量价
 * @param type
 * @param date
 */
export const queryLiangJia = async (
  liangjiaDateRange: string[],
  jcgsHotDateRange: string[],
  type: THSCaptchTypeEnum
): Promise<Stock[]> => {
  const Model = mongoose.model(t_ths_liangjia, LiangJiaSchema);
  const models = await Model.find({ date: { $in: liangjiaDateRange }, type: type });
  const stocks = await queryRangeHotStocks(jcgsHotDateRange);
  const liangjiaStocks = models.map((item) => mapLiangJiaStock(item));
  return crossStocks(stocks, liangjiaStocks);
};
/**
 * 计算出同花顺的量价行为和韭菜公社股票异动的股票交集
 * @param jiucaigongsheStocks
 * @param thsLiangjiaStocks
 * @returns
 */
function crossStocks(jiucaigongsheStocks: Stock[], thsLiangjiaStocks: LiangJiaStock[]): Stock[] {
  const findStocks: Stock[] = [];
  thsLiangjiaStocks.forEach((stock) => {
    if (!stock.code) {
      return;
    }
    const find = jiucaigongsheStocks.find((item) => item.name === stock.name);
    if (!find) {
      return;
    }
    const exist = findStocks.find((item) => item.name === find.name);
    if (!exist) {
      findStocks.push(find);
    }
  });
  return findStocks;
}
