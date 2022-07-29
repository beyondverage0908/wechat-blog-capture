import mongoose from "mongoose";
import { t_jcgs_category, t_jcgs_stock } from "@/mongodb/model";
import { CategorySchema, StockSchema } from "../schema/jiucaigongshe/hot";
import { Stock } from "../../types/jiucaigongshe";

function mapStock(stock: Stock): Stock {
  return {
    name: stock.name,
    code: stock.code,
    price: stock.price,
    percent: stock.percent,
    time: stock.time,
    desc: stock.desc,
    descLink: stock.descLink,
  };
}
/**
 * 查询指定范围的异动数据
 * @param dateRange
 * @returns
 */
export const queryRangeHotStocks = async (dateRange: string[]): Promise<Stock[]> => {
  const CategoryModel = await mongoose.model(t_jcgs_category, CategorySchema);
  const StockModel = await mongoose.model(t_jcgs_stock, StockSchema);
  const categorys = await CategoryModel.find({ day: { $in: dateRange } });
  let stocks: Stock[] = [];
  for await (const cate of categorys) {
    const findStocks = await StockModel.find({ category_id: cate._id });
    stocks = stocks.concat(
      findStocks.map((stock) => ({
        ...mapStock(stock),
        category: cate.category,
        day: cate.day,
      }))
    );
  }
  return stocks;
};
