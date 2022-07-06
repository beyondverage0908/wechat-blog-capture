import mongoose, { Schema } from "mongoose";

// 行情结构定义
export const HqSchema = new mongoose.Schema({
  day: Schema.Types.String,
  name: Schema.Types.String,
  change: Schema.Types.Number,
  percent: Schema.Types.Number,
  time: Schema.Types.String,
});
