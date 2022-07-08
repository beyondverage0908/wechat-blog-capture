import dayjs, { Dayjs } from "dayjs";

type DateType = string | Dayjs | Date | number;

export default {
  /**
   * 格式化 YYYY-MM-DD
   * @param date
   * @returns
   */
  format(date?: DateType) {
    return dayjs(date).format("YYYY-MM-DD");
  },
  /**
   * 格式化 YYYY-MM-DD HH:mm:ss
   * @param date
   * @returns
   */
  fullFormat(date?: DateType) {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  },
  /**
   * 根据其实时间和结束时间获取时间范围输入
   * @param startDate
   * @param endDate
   * @returns
   */
  range(startDate: string, endDate: string) {
    if (!startDate || !endDate) return [];
    const diff = dayjs(endDate).diff(startDate, "day");
    const range = Array.from({ length: diff }, (_, i) => {
      return dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
    });
    return [...range, endDate];
  },
};
