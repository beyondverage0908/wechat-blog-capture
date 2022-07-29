import { THSCaptchTypeEnum } from "@/types/tonghuashun";
import { LiangJiaStock } from "@/types/tonghuashun";

/**
 * 转换数据
 * @param map
 * @returns
 */
export const convertMapToArray = (map: Map<string, string[]>) => {
  let array: string[] = [];
  map.forEach((values) => {
    array = array.concat(values);
  });
  return array;
};
/**
 * 转化爬取数据
 * @param list: ["1,002151,北斗星通,30.52,5,-5.83,7.50,国防军工", "152,600753,东方银星,12.91,2,-1.00,1.73,物流"]
 */
export const converArrayToLiangJia = (stocks: string[], thsType: THSCaptchTypeEnum, date: string) => {
  return stocks.map((str) => {
    const stock: LiangJiaStock = {};
    try {
      const arr = str.split(",");
      stock.code = arr[1] || "";
      stock.name = arr[2] || "";
      stock.price = arr[3] !== "-" ? Number(arr[3]) : undefined;
      stock.days = arr[4] !== "-" ? Number(arr[4]) : undefined;
      stock.percent = arr[5] !== "-" ? Number(arr[5]) : undefined;
      stock.overrate = arr[6] !== "-" ? Number(arr[6]) : undefined;
      stock.industry = arr[7] || "";
      stock.type = String(thsType);
      stock.date = date;
      return stock;
    } catch (error) {
      return stock;
    }
  });
};
