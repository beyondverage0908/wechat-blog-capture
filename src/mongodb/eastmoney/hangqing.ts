import mongoose from "mongoose";
import { HqSchema } from "@/mongodb/schema/eastmoney";
import { HqStock } from "@/types/eastmoney";
import { t_em_hq } from "@/mongodb/model";
import { createLogger } from "@/middleware/logger";
import dayjs from "dayjs";
const logger = createLogger("Eastmoney-Action");

// 插入数据到表中
const insertHqData = async (hqList: HqStock[], day: string) => {
  const HqStockModel = mongoose.model(t_em_hq, HqSchema);
  const result = await HqStockModel.insertMany(
    hqList.map((item) => ({
      day: day,
      name: item.name,
      change: item.change ? Number(item.change) : null,
      percent:
        item.percent && item.percent.includes("%")
          ? Number(item.percent.replace("%", ""))
          : null,
      time: dayjs().format("HH:mm:ss"),
    }))
  );
  return result;
};

/**
 * 行情数据插入
 * @param hqList
 * @param day
 * @returns
 */
export const saveHqData = async (hqList: HqStock[], day: string) => {
  logger.info("准备存储数据");
  const HqStockModel = mongoose.model(t_em_hq, HqSchema);
  const count = await HqStockModel.find({ day: day }).count();
  if (!count) {
    // 新增
    await insertHqData(hqList, day);
    logger.info("准备存储数据（新增）-完成");
    return true;
  } else {
    // 更新
    const result = await HqStockModel.deleteMany({ day });
    if (result.acknowledged) {
      await insertHqData(hqList, day);
      logger.info("准备存储数据（更新）-完成");
      return true;
    }
  }
  return false;
};
