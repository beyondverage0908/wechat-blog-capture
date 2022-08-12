/**
 * 量价关系
 */

import mongoose, { FilterQuery } from "mongoose";
import { createLogger } from "@/middleware/logger";
import { t_ths_liangjia, t_ths_liangjia_target } from "../model";
import { LiangJiaSchema, LiangJiaTargetSchema } from "../schema/tonghuashun";
import { LiangJiaStock, THSCaptchTypeEnum } from "@/types/tonghuashun";
import { queryRangeHotStocks } from "@/mongodb/jiucaigongshe/liangjia";
import { Stock } from "@/types/jiucaigongshe";
import dateTool from "@/lib/date";
import stockTool from "@/works/stock/tool";
import { getGroupStockPrice } from "@/works/stock/price";
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

/**
 * 分析量价齐升和量价齐跌和韭菜公社之间的关系，并把数据入库
 * @returns
 */
export const saveTargetLiangjia = async () => {
  logger.info("开始量价分析【量价齐升】【量价齐跌】");
  const liangjiaDateRange = dateTool.recentRange(2);
  const jcgsDateRange = dateTool.recentRange(10);
  const TargetModel = mongoose.model(t_ths_liangjia_target, LiangJiaTargetSchema);
  const LiangJiaModel = mongoose.model(t_ths_liangjia, LiangJiaSchema);
  const currentDate = dateTool.format();
  // -1表示降序，1表示升序
  const limitModels = await LiangJiaModel.find().sort({ date: -1 }).limit(1);
  if (!limitModels.length) {
    logger.info("当前日期数据已存在，或者未爬取到THS的量价数据");
    return "当前日期数据已存在，或者未爬取到THS的量价数据";
  }
  if (limitModels[0].date !== currentDate) {
    logger.info(
      `当前量价表最近一日数据时间:${limitModels[0].date}，触发时间为：${currentDate}，两者时间不相符，不能进行分析`
    );
    return `当前量价表最近一日数据时间:${limitModels[0].date}，触发时间为：${currentDate}，两者时间不相符，不能进行分析`;
  }
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

type GetLiangJiaQueryType = {
  monit?: string;
};

// 获取量价关系表
export const getLiangJiaTarget = async ({ monit }: GetLiangJiaQueryType) => {
  const TargetModel = mongoose.model(t_ths_liangjia_target, LiangJiaTargetSchema);
  const filter: GetLiangJiaQueryType = {};
  monit ? (filter["monit"] = monit) : null;
  const result = await TargetModel.find(filter).sort({ checkTime: "desc" });
  return result;
};
// 更新监控状态
export const updateLiangJiaTargetMonit = async (id: string, monit: string) => {
  const TargetModel = mongoose.model(t_ths_liangjia_target, LiangJiaTargetSchema);
  return await TargetModel.updateOne({ _id: id }, { monit: monit, checkType: CheckType.manual });
};

/**
 * 爬取量价关系表中当前正在监控中，且未爬取过股票的股票
 * @param immediately 是否立即执行
 * @returns
 */
export const updateLiangJiaTargetMonitPrice = async (immediately?: boolean) => {
  if (!immediately) {
    return;
  }
  const TargetModel = mongoose.model(t_ths_liangjia_target, LiangJiaTargetSchema);
  const rows = await TargetModel.find({ monit: MonitType.moniting, checkPrice: null }).sort({ checkTime: "desc" });
  const securityCodes = rows.map((item) => item.code!!);
  const formatSecurityCodes = stockTool.formatShSzStocks(securityCodes);
  logger.info(`准备开始爬取：${formatSecurityCodes} 的股价`);
  const priceValues = await getGroupStockPrice(formatSecurityCodes);
  for await (const code of securityCodes) {
    const index = securityCodes.indexOf(code);
    // 防止爬取的股票没有股价
    const priceValue = !!parseFloat(priceValues[index]) ? priceValues[index] : null;
    console.log(code, parseFloat(priceValues[index]), !!parseFloat(priceValues[index]), priceValue);
    await TargetModel.updateMany({ code: code, monit: MonitType.moniting }, { $set: { checkPrice: priceValue } });
  }
  return priceValues;
};
