import http from "./http";

export const getActionRange = (startDate: string, endDate: string) => {
  return http.get("/jiucaigongshe/action", {
    params: {
      startDate,
      endDate,
    },
  });
};
