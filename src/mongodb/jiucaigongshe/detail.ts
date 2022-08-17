import mongoose from "mongoose";
import { CategorySchema, StockSchema } from "@/mongodb/schema/jiucaigongshe/hot";
import { Category, Stock } from "@/types/jiucaigongshe";
import { t_jcgs_category, t_jcgs_stock } from "../model";
import { createLogger } from "@/middleware/logger";

class JcgsStock {
  public async getDetail(code: string) {
    const StockModel = mongoose.model(t_jcgs_stock, StockSchema);
    const result = await StockModel.aggregate([
      {
        $lookup: {
          from: "t_jcgs_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $match: {
          code: code,
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "category._id": 0,
          "category.__v": 0,
        },
      },
    ]);
    return result;
  }
}

export default JcgsStock;
