import mongoose from "mongoose";
import { CategorySchema, StockSchema } from "@/mongodb/schema/jiucaigongshe/hot";
import { t_jcgs_category, t_jcgs_stock } from "../model";

type HotTagType = {
  _id: string;
  count: number;
};

class HotTag {
  public async getHotTag(days: string[]): Promise<HotTagType[]> {
    console.log(days);
    const CategryModel = mongoose.model(t_jcgs_category, CategorySchema);
    const result: HotTagType[] = await CategryModel.aggregate([
      { $match: { day: { $in: days } } },
      {
        $lookup: {
          from: `${t_jcgs_stock}s`,
          localField: "_id",
          foreignField: "category_id",
          as: "categoryStocks",
        },
      },
      {
        $addFields: {
          total: {
            $size: "$categoryStocks",
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: "$total" },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return result;
  }
}

export default HotTag;
