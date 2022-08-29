// 股票开头
const PREFIX_CODE_SIX = "6";
const PREFIX_CODE_ZERO = "0";
const PREFIX_CODE_THREE = "3";

enum SecurityStart {
  sh = "sh",
  sz = "sz",
  bj = "bj",
}

class StockTool {
  /**
   * 将证券代码转换为0.xxxx，1.xxxx的格式
   * @param code
   * @returns
   */
  public formatStockCode(code: string) {
    if (code.startsWith(PREFIX_CODE_SIX)) {
      return `1.${code}`;
    } else if (code.startsWith(PREFIX_CODE_ZERO) || code.startsWith(PREFIX_CODE_THREE)) {
      return `0.${code}`;
    }
    return `1.${code}`;
  }
  /**
   * 组别，将证券代码转换为0.xxxx，1.xxxx的格式
   * @param codes
   * @returns
   */
  public formatStockCodes(codes: string[]) {
    return codes.map((code) => this.formatStockCode(code));
  }
  /**
   * 将带有前缀的sh，sz的股票代码转换为不带前缀的证券代码
   * @param code
   */
  public formatShSzStock(code: string) {
    const lowerCode = code.toLowerCase();
    if (!lowerCode.includes(SecurityStart.sh) && !lowerCode.includes(SecurityStart.sz)) {
      return lowerCode;
    }
    if (lowerCode.startsWith(SecurityStart.sh)) {
      return lowerCode.replace("sh", "");
    }
    if (lowerCode.startsWith(SecurityStart.sz)) {
      return lowerCode.replace("sz", "");
    }
    return lowerCode;
  }
  public formatShSzStocks(codes: string[]) {
    // 运行过程中发现有些证券代码是以bj开头的，导致爬取失败，先过滤
    return codes.filter((code) => !code.startsWith(SecurityStart.bj)).map((code) => this.formatShSzStock(code));
  }
}

export default new StockTool();
