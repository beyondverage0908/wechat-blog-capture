import dayjs, { Dayjs } from "dayjs";

type DateType = string | Dayjs | Date | number;

export default {
  /**
   * 格式化 YYYY-MM-DD
   * @param date
   * @returns
   */
  format(date?: DateType) {
    // 需要构建一个新的日期对象，在centeos系统中，如果在定时任务中仅仅调用dayjs()，他的日期对象是会被复用的，导致长期都是一个历史日期，只要在reload程序后才会读取到最新的日期
    const fdate = date || new Date();
    return dayjs(fdate).format("YYYY-MM-DD");
  },
  /**
   * 格式化 YYYY-MM-DD HH:mm:ss
   * @param date
   * @returns
   */
  fullFormat(date?: DateType) {
    const fdate = date || new Date();
    return dayjs(fdate).format("YYYY-MM-DD HH:mm:ss");
  },
  /**
   * 根据其实时间和结束时间获取时间范围输入，生成[YYYY-MM-DD, YYYY-MM-DD, YYYY-MM-DD]
   * @param startDate
   * @param endDate
   * @returns [YYYY-MM-DD, YYYY-MM-DD, YYYY-MM-DD]
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
