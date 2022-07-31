import http from "./http";

type DateRange = { startDate: string; endDate: string };

/**
 * 获取指定范围时间内的异动数据
 * @param startDate
 * @param endDate
 * @returns
 */
export const getActionRange = (recentDay?: number, range?: DateRange) => {
  return http.get("/jiucaigongshe/action", {
    params: {
      recentDay,
      startDate: range?.startDate,
      endDate: range?.endDate,
    },
  });
};
/**
 * 触发当日异动数据的爬取
 * @returns
 */
export const pickupTodayAction = () => {
  return http.get("/jiucaigongshe/today");
};
