import { THSCaptchTypeEnum } from "./tool";
import { LiangJiaStock } from "./types";

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
    const arr = str.split(",");
    stock.code = arr[1] || "";
    stock.name = arr[2] || "";
    stock.price = Number(arr[3]) !== null ? Number(arr[3]) : undefined;
    stock.days = Number(arr[4]) !== null ? Number(arr[4]) : undefined;
    stock.percent = Number(arr[5]) !== null ? Number(arr[5]) : undefined;
    stock.overrate = Number(arr[6]) !== null ? Number(arr[6]) : undefined;
    stock.industry = arr[7] || "";
    stock.type = String(thsType);
    stock.date = date;
    return stock;
  });
};
