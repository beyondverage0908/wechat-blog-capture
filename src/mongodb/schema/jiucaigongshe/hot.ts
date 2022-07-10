import mongoose from "mongoose";
import { SchemaTypes } from "mongoose";

export const StockSchema = new mongoose.Schema({
  name: SchemaTypes.String, // 股票名称
  code: SchemaTypes.String, // 股票代码
  price: SchemaTypes.String, // 涨停的价格
  percent: SchemaTypes.String, // 涨跌幅
  time: SchemaTypes.String, // 当日涨停时间
  desc: SchemaTypes.String, // 股票描述
  desc_link: SchemaTypes.String, // 关联的股票描述详情地址
  category_id: SchemaTypes.ObjectId, // 所述分类的id
});

export const CategorySchema = new mongoose.Schema({
  category: String, // 分类名
  number: Number, // 当日该分类下涨停数量
  day: SchemaTypes.String, // 日期
});
