import mongoose, { Schema } from "mongoose";
import {
  CategorySchema,
  StockSchema,
} from "@/mongodb/schema/jiucaigongshe/hot";
import { Category, Stock } from "@/types/jiucaigongshe";
import { t_jcgs_category, t_jcgs_stock } from "../model";
import { createLogger } from "@/middleware/logger";

const logger = createLogger("JiuCaiGongShe-Actions");

/**
 * 批量插入股票信息
 * @param stocks
 * @param categoryId
 * @returns
 */
const insertStocks = async (stocks?: Stock[], categoryId?: any) => {
  if (!stocks) return;
  const StockModel = mongoose.model(t_jcgs_stock, StockSchema);
  await StockModel.insertMany(
    stocks.map((item) => ({
      ...item,
      desc_link: item.descLink,
      category_id: categoryId,
    }))
  );
};

/**
 * 插入某日的的数据落库
 * @param category
 * @param day
 * @returns
 */
const insertCategory = async (category: Category, day: string) => {
  if (!category) return;
  const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
  const categoryInstance = new CategoryModel({ ...category, day });
  const result = await categoryInstance.save();
  return result;
};

/**
 * 插入每日异动
 * @param categorys
 * @param day
 * @returns
 */
export const insertHot = async (categorys: Category[], day: string) => {
  const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
  const count = await CategoryModel.find({ day: day }).count();
  if (count) {
    logger.info(`数据库已经存在${day}的数据了，无需再插入数据`);
    return;
  }
  categorys.forEach(async (cate) => {
    const result = await insertCategory(cate, day);
    insertStocks(cate.stocks, result?._id);
  });
};
