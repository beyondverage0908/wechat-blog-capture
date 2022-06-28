import date from "@/lib/date";

export const countPcUrl =
  "https://app.jiucaigongshe.com/jystock-app/api/v1/action/count-pc";

export const getActionUrl = (dateString?: string) =>
  `https://www.jiucaigongshe.com/action/${date.format(dateString)}`;

export const mainUrl = "https://www.jiucaigongshe.com/";
