import date from "@/lib/date";

export const domainUrl = "https://www.jiucaigongshe.com";

export const countPcUrl =
  "https://app.jiucaigongshe.com/jystock-app/api/v1/action/count-pc";

export const getActionUrl = (dateString?: string) =>
  `${domainUrl}/action/${date.format(dateString)}`;

export const mainUrl = `${domainUrl}`;
