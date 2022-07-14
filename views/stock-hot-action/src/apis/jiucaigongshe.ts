import http from "./http";

/**
 * 获取指定范围时间内的异动数据
 * @param startDate
 * @param endDate
 * @returns
 */
export const getActionRange = (startDate: string, endDate: string) => {
  return http.get("/jiucaigongshe/action", {
    params: {
      startDate,
      endDate,
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
