import mongoose from "mongoose";
import { SchemaTypes } from "mongoose";

// 量价齐升表，量价齐跌的量价表
export const LiangJiaSchema = new mongoose.Schema({
  name: SchemaTypes.String, // 股票名称
  code: SchemaTypes.String, // 股票代码
  price: SchemaTypes.Number, // 最新价格
  percent: SchemaTypes.Number, // 涨跌幅
  overrate: SchemaTypes.Number, // 累计换手率
  industry: SchemaTypes.String, // 所属行业
  days: SchemaTypes.Number, // 量价齐跌/升天数
  type: SchemaTypes.String, // 跌或升
  date: SchemaTypes.String, // 爬取天数
});

// 根据量价关系命中的股票表
export const LiangJiaTargetSchema = new mongoose.Schema({
  name: SchemaTypes.String, // 股票名称
  code: SchemaTypes.String, // 股票代码
  monit: SchemaTypes.String, // 是否监控 1：监控 2：不监控
  checkTime: SchemaTypes.String, // 命中入选时间
  uncheckTime: SchemaTypes.String, // 移除监听时间
  checkPrice: SchemaTypes.Number, // 入选当日收盘价格
  uncheckPrice: SchemaTypes.Number, // 移除监听时候的价格
  price7: SchemaTypes.Number, // 监听第七日收盘价格
  price14: SchemaTypes.Number, // 监听第14日收盘价格
  checkType: SchemaTypes.String, // 入选方式 1：自动 2：手动入选
});
