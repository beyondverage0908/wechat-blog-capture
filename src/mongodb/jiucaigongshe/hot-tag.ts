import mongoose, { mongo } from "mongoose";
import { CategorySchema, StockSchema, HotTagSchema } from "@/mongodb/schema/jiucaigongshe/hot";
import { t_jcgs_category, t_jcgs_stock, t_jcgs_hot_tag } from "../model";
import date from "@/lib/date";

type HotTagType = {
  _id: string;
  count: number;
};

class HotTag {
  /**
   * 获取热门标签
   * @param days
   * @returns
   */
  public async getHotTag(days: string[]): Promise<HotTagType[]> {
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
  /**
   * 保存热门标签
   * @param hotTags
   * @returns
   */
  public async saveHotTag(hotTags: string[]) {
    const HotTagModel = mongoose.model(t_jcgs_hot_tag, HotTagSchema);
    const inputDate = date.fullFormat();
    const manyHotTags = hotTags.map((tag) => ({ name: tag, inputDate: inputDate }));
    // 先删除所有
    await HotTagModel.deleteMany({});
    return await HotTagModel.insertMany(manyHotTags);
  }
  /**
   * 获取所有的选中的人们标签
   * @returns
   */
  public async getCheckedHotTags() {
    const HotTagModel = mongoose.model(t_jcgs_hot_tag, HotTagSchema);
    return await HotTagModel.find({});
  }
}

export default HotTag;
