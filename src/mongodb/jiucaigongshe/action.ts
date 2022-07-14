import mongoose from "mongoose";
import {
  CategorySchema,
  StockSchema,
} from "@/mongodb/schema/jiucaigongshe/hot";
import { Category, Stock } from "@/types/jiucaigongshe";
import { t_jcgs_category, t_jcgs_stock } from "../model";
import { createLogger } from "@/middleware/logger";

const logger = createLogger("JiuCaiGongShe-Actions");

type RangeAction = { day?: string } & Category;

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
export const insertHot = async (categorys: Category[] = [], day: string) => {
  const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
  const count = await CategoryModel.find({ day: day }).count();
  if (count) {
    logger.info(`数据库已经存在${day}的数据了，无需再插入数据`);
    return false;
  }
  categorys.forEach(async (cate) => {
    const result = await insertCategory(cate, day);
    insertStocks(cate.stocks, result?._id);
  });
  return true;
};
/**
 * 更新每日数据
 * @param category
 * @param day
 */
export const updateHot = async (categorys: Category[] = [], day: string) => {
  const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
  const count = await CategoryModel.find({ day: day }).count();
  if (!count) {
    await insertHot(categorys, day);
    return false;
  }
  logger.info("更新数据过程中先删除Category数据");
  // 使用先删除，在插入的方式进行更新
  const categoryResultList = await CategoryModel.find({ day });
  const categoryIds = categoryResultList.map((item) => item._id);
  // 删除stocks中指定通过category_id
  const StockMode = mongoose.model(t_jcgs_stock, StockSchema);
  for await (const id of categoryIds) {
    await StockMode.deleteMany({ category_id: id });
  }
  // 删除category中的数据
  const deleteCategory = await CategoryModel.deleteMany({ day: day });
  if (deleteCategory.acknowledged) {
    logger.info("更新数据过程中已经删除Category数据");
    const result = await insertHot(categorys, day);
    return result;
  }
  return false;
};
/**
 * 查询指定时间范围的异动数据
 * @param dateRange
 * @returns
 */
export const queryActionOfRange = async (dateRange: string[]) => {
  const CategoryModel = mongoose.model(t_jcgs_category, CategorySchema);
  const rows = await CategoryModel.find({ day: { $in: dateRange } });
  const StockModel = mongoose.model(t_jcgs_stock, StockSchema);
  const results: RangeAction[] = [];
  for await (const item of rows) {
    const m: RangeAction = {
      category: item.category,
      number: item.number,
      day: item.day,
      stocks: [],
    };
    const stocks = await StockModel.find({ category_id: item._id });
    m.stocks = stocks.map((s) => ({
      name: s.name,
      code: s.code,
      price: s.price,
      percent: s.percent,
      time: s.time,
      desc: s.desc,
      descLink: s.desc_link,
      day: item.day,
    }));
    results.push(m);
  }
  return results;
};
