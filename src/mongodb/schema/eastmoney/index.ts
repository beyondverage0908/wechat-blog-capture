import mongoose, { Schema } from "mongoose";

// 行情结构定义
export const HqSchema = new mongoose.Schema({
  day: Schema.Types.String, // 记录日期
  name: Schema.Types.String, // 股票名称
  price: Schema.Types.Number, // 当前点数
  change: Schema.Types.Number, // 变化点数
  percent: Schema.Types.Number, // 变化百分比
  time: Schema.Types.String, // 记录时间
});
