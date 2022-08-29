import { createPuppeteer } from "@/util/puppeteer";
import { devices } from "puppeteer";
import Tool from "@/works/stock/tool";
import { createLogger } from "@/logger";
const logger = createLogger();

const SOTCK_VALUE_SELECTOR_ID = "#inum .stock-value";

/**
 * 获取当前股价
 * @param code
 */
export async function getCurrentPrice(code: string) {
  let stockValue = null;
  const { browser, page } = await createPuppeteer();
  try {
    const url = `https://wap.eastmoney.com/quote/stock/${Tool.formatStockCode(code)}.html`;
    // 利用puppeteer内置的模拟器
    await page.emulate(devices["iPhone 6"]);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    // await page.screenshot({ fullPage: true, path: "xx.png" });
    const element = await page.waitForSelector(SOTCK_VALUE_SELECTOR_ID, { timeout: 10000 });
    stockValue = await element?.evaluate((el) => el.textContent?.trim());
    await page.close();
    await browser.close();
  } catch (error) {
    logger.error(`爬取当前股票价格出现异常: ${code}`);
    throw error;
  }
  return stockValue;
}
/**
 *
 * @param code
 * @returns
 */
export async function getGroupStockPrice(codes: string[]) {
  // const codes = ["000001", "000002", "000003", "000004", "000005", "000006", "000007", "000008", "000009"];
  let stockValues: string[] = [];
  if (!codes || !codes.length) {
    return stockValues;
  }
  // 利用puppeteer内置的模拟器
  const { browser, page } = await createPuppeteer();
  await page.emulate(devices["iPhone 6"]);
  try {
    for await (const code of codes) {
      // 校验证券代码必须是6位的
      if (code.length !== 6) {
        stockValues.push("-");
      }
      // 东方财富行情页面
      const url = `https://wap.eastmoney.com/quote/stock/${Tool.formatStockCode(code)}.html`;
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const element = await page.waitForSelector(SOTCK_VALUE_SELECTOR_ID, { timeout: 10000 });
      const stockValue = await element?.evaluate((el) => el.textContent?.trim());
      stockValues.push(stockValue || "-");
    }
  } catch (error) {
    logger.error(`爬取当前股票价格出现异常: ${codes}`);
    throw error;
  }

  await page.close();
  await browser.close();
  return stockValues;
}
