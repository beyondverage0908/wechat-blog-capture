// 股票开头
const PREFIX_CODE_SIX = "6";
const PREFIX_CODE_ZERO = "0";
const PREFIX_CODE_THREE = "3";

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
    if (!lowerCode.includes("sh") && !lowerCode.includes("sz")) {
      return lowerCode;
    }
    if (lowerCode.startsWith("sh")) {
      return lowerCode.replace("sh", "");
    }
    if (lowerCode.startsWith("sz")) {
      return lowerCode.replace("sz", "");
    }
    return lowerCode;
  }
  public formatShSzStocks(codes: string[]) {
    return codes.map((code) => this.formatShSzStock(code));
  }
}

export default new StockTool();
