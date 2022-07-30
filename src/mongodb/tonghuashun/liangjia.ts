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
 *
 * @param liangjiaDateRange 量价爬取的时间范围
 * @param jcgsHotDateRange  韭菜公社热点爬取的时间范围
 * @param dayNumber         量价关系连续天数（比如：量价齐跌的天数）
 * @param type              量价关系（量价齐跌，量价起升）
 * @returns
 */
export const queryLiangJia = async (
  liangjiaDateRange: string[],
  jcgsHotDateRange: string[],
  dayNumber: number,
  type: THSCaptchTypeEnum
): Promise<Stock[]> => {
  const LJModel = mongoose.model(t_ths_liangjia, LiangJiaSchema);
  const models = await LJModel.find({
    date: {
      $in: liangjiaDateRange,
    },
    days: {
      $gte: dayNumber,
    },
    type: type,
  });
  const stocks = await queryRangeHotStocks(jcgsHotDateRange);
  const liangjiaStocks = models.map((item) => mapLiangJiaStock(item));
  return crossStocks(stocks, liangjiaStocks);
};

type ThsStock = Stock & { thsIndustry?: string; thsSeriesDay?: number; thsOverrate?: number; thsDate?: string };

/**
 * 计算出同花顺的量价行为和韭菜公社股票异动的股票交集
 * @param jiucaigongsheStocks
 * @param thsLiangjiaStocks
 * @returns
 */
function crossStocks(jiucaigongsheStocks: Stock[], thsLiangjiaStocks: LiangJiaStock[]): ThsStock[] {
  const findStocks: ThsStock[] = [];
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
      findStocks.push({
        ...find,
        thsIndustry: stock.industry,
        thsSeriesDay: stock.days,
        thsOverrate: stock.overrate,
        thsDate: stock.date,
      });
    }
  });
  return findStocks;
}
