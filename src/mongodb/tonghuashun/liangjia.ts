/**
 * 量价关系
 */

import mongoose from "mongoose";
import { createLogger } from "@/middleware/logger";
import { t_ths_liangjia, t_ths_liangjia_target } from "../model";
import { LiangJiaSchema, LiangJiaTargetSchema } from "../schema/tonghuashun";
import { LiangJiaStock, THSCaptchTypeEnum } from "@/types/tonghuashun";
import { queryRangeHotStocks } from "@/mongodb/jiucaigongshe/liangjia";
import { Stock } from "@/types/jiucaigongshe";
import dateTool from "@/lib/date";
const logger = createLogger("TongHuaShunDB");

type ThsStock = Stock & {
  category?: string;
  thsIndustry?: string;
  thsSeriesDay?: number;
  thsOverrate?: number;
  thsDate?: string;
  days?: number;
};
// 量价关系监控表 - 是否监控 1：监控 2：不监控 3: 暂定
enum MonitType {
  moniting = "1",
  notMonit = "2",
  waiting = "3",
}
// 入选方式 1：自动 2：手动入选
enum CheckType {
  auto = "1",
  manual = "2",
}

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
/**
 * 保存量价数据到数据库中
 * @param stocks
 * @returns
 */
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
): Promise<ThsStock[]> => {
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
        days: stock.days,
      });
    }
  });
  return findStocks;
}

export const saveTargetLiangjia = async () => {
  logger.info("开始量价分析【量价齐升】【量价齐跌】");
  const liangjiaDateRange = dateTool.recentRange(2);
  const jcgsDateRange = dateTool.recentRange(10);
  const TargetModel = mongoose.model(t_ths_liangjia_target, LiangJiaTargetSchema);
  const currentDate = dateTool.format();
  const ljqdcount = await TargetModel.find({ checkTime: currentDate, ljtype: THSCaptchTypeEnum.ljqd }).count();
  const ljqsCount = await TargetModel.find({ checkTime: currentDate, ljtype: THSCaptchTypeEnum.ljqs }).count();
  if (ljqdcount && ljqsCount) {
    logger.info("已经存在当日数据，不需要继续插入");
    return "已经存在当日数据，不需要继续插入";
  }
  if (!ljqdcount) {
    const seriesDay = 3; // 连续天数
    const stocks = await queryLiangJia(liangjiaDateRange, jcgsDateRange, seriesDay, THSCaptchTypeEnum.ljqd);
    await TargetModel.insertMany(
      stocks.map((item) => ({
        name: item.name,
        code: item.code,
        monit: MonitType.waiting,
        checkTime: currentDate,
        uncheckTime: null,
        checkPrice: null,
        uncheckPrice: null,
        price7: null,
        price14: null,
        checkType: CheckType.auto,
        ljtype: THSCaptchTypeEnum.ljqd,
        seriesDay: item.days,
        category: item.category,
        industry: item.thsIndustry,
      }))
    );
  }
  if (!ljqsCount) {
    const seriesDay = 3; // 连续天数
    const stocks = await queryLiangJia(liangjiaDateRange, jcgsDateRange, seriesDay, THSCaptchTypeEnum.ljqs);
    await TargetModel.insertMany(
      stocks.map((item) => ({
        name: item.name,
        code: item.code,
        monit: MonitType.waiting,
        checkTime: currentDate,
        uncheckTime: null,
        checkPrice: null,
        uncheckPrice: null,
        price7: null,
        price14: null,
        checkType: CheckType.auto,
        ljtype: THSCaptchTypeEnum.ljqs,
        seriesDay: item.days,
        category: item.category,
        industry: item.thsIndustry,
      }))
    );
  }
  logger.info("结束量价分析【量价齐升】【量价齐跌】，插入成功");
  return "插入成功";
};
