import mongoose from "mongoose";
import { SchemaTypes } from "mongoose";

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
