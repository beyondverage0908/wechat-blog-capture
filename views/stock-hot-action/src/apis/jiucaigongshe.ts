import axios from "axios";

export const getActionRange = (startDate: string, endDate: string) => {
  return axios.get("/pac/api/jiucaigongshe/action", {
    params: {
      startDate,
      endDate,
    },
  });
};
