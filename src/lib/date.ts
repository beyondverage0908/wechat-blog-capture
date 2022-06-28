import dayjs, { Dayjs } from "dayjs";

type DateType = string | Dayjs | Date | number;

export default {
  format(date?: DateType) {
    return dayjs(date).format("YYYY-MM-DD");
  },
  fullFormat(date?: DateType) {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  },
};
