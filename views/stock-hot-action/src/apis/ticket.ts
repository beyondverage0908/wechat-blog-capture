import http from "./http";

/**
 * Get方式生成小票
 * @returns
 */
export const getTicketPickUp = (dateList: string[]) => {
  return http.get("/ticket/generate", {
    params: { dateList: dateList.join(",") },
  });
};
/**
 * Get方式生成小票
 * @param dateList
 * @returns
 */
export const postTicketPickUp = (dateList: string[]) => {
  return http.post("/ticket/generate", {
    data: { dateList },
  });
};
