// 是否监控 1：监控中 2：已移除监控 3: 暂定
export enum MonitType {
  moniting = "1",
  removed = "2",
  wait = "3",
}
/**
 * 加入监控的方式
 */
export enum CheckType {
  auto = "1",
  manual = "2",
}
/**
 * 量价关系
 */
export enum LiangJiaType {
  ljqd = "ljqd",
  ljqs = "ljqs",
}

export type ColumnRowData = {
  _id: string;
  name: string;
  code: string;
  monit: MonitType;
  checkTime: string;
  uncheckTime: string;
  checkPrice: string;
  uncheckPrice: string;
  price7: string;
  price14: string;
  checkType: CheckType;
  ljtype: LiangJiaType;
  seriesDay: string;
  category: string;
  industry: string;
};
