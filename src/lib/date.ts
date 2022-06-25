import dayjs, { Dayjs } from "dayjs";

export default {
  format(date?: string | Dayjs | Date) {
    return dayjs(date).format("YYYY-MM-DD");
  },
};
