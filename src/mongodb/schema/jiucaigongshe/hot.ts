import mongoose from "mongoose";
import { SchemaTypes } from "mongoose";

export const StockSchema = new mongoose.Schema({
  name: SchemaTypes.String,
  code: SchemaTypes.String,
  price: SchemaTypes.String,
  percent: SchemaTypes.String,
  time: SchemaTypes.String,
  desc: SchemaTypes.String,
  desc_link: SchemaTypes.String,
  category_id: SchemaTypes.ObjectId,
});

export const CategorySchema = new mongoose.Schema({
  category: String,
  number: Number,
  day: SchemaTypes.String,
});
