export interface LiangJiaStock {
  name?: string; // 股票名称
  code?: string; // 股票代码
  price?: number; // 最新价格
  percent?: number; // 涨跌幅
  overrate?: number; // 累计换手率
  industry?: string; // 所属行业
  days?: number; // 量价齐跌/升天数
  type?: string; // 跌或升
  date?: string;
}
