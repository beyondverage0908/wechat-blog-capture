/**
 * 量价分析策略的参数
 *
 * ljRecentDay: 是最近的几日出现了量价行为
 * jcgsRecentDay：匹配韭菜公社最近多少日出现股票异动
 * ljqdSeriesDay：量价齐跌最少出现几日（大于等于的关系）
 * ljqsSeriesDay：量价齐升最少出现几日（大于等于的关系）
 */
export default {
  ljRecentDay: 2,
  jcgsRecentDay: 10,
  ljqdSeriesDay: 3,
  ljqsSeriesDay: 4,
};
