// 股票开头
const PREFIX_CODE_SIX = "6";
const PREFIX_CODE_ZERO = "0";
const PREFIX_CODE_THREE = "3";

class StockTool {
  public formatStockCode(code: string) {
    if (code.startsWith(PREFIX_CODE_SIX)) {
      return `1.${code}`;
    } else if (code.startsWith(PREFIX_CODE_ZERO) || code.startsWith(PREFIX_CODE_THREE)) {
      return `0.${code}`;
    }
    return `1.${code}`;
  }
  public formatStockCodes(codes: string[]) {
    return codes.map((code) => this.formatStockCode(code));
  }
}

export default new StockTool();
