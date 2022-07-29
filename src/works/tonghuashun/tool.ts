import puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { convertMapToArray, converArrayToLiangJia } from "./map";
import { createLogger } from "@/middleware/logger";
import { LiangJiaStock, THSCaptchTypeEnum } from "@/types/tonghuashun";
const logger = createLogger("TongHuaShun");

type ThsCaptch = {
  [key in allThsCaptch]: {
    url: string;
    type: THSCaptchTypeEnum;
  };
};

type allThsCaptch = "ljqd" | "ljqs";

const PAGE_INFO_SELECTOR = ".J-ajax-page .page_info";
const NEXT_PAGE_XPATH = "//*[@id='J-ajax-main']/div/a[contains(., '下一页')]";
const TARGET_TABLE_SELECTOR = "#J-ajax-main .J-ajax-table tbody";
const CURRENT_PAGE_SELECTOR = ".J-ajax-page .cur";
const CURRENT_DATE_XPATH = '//*[@id="datacenter_change_content"]/div[1]/div';

export const thsCaptch: ThsCaptch = {
  ljqd: {
    url: "http://data.10jqka.com.cn/rank/ljqd/",
    type: THSCaptchTypeEnum.ljqd,
  },
  ljqs: {
    url: "http://data.10jqka.com.cn/rank/ljqs/",
    type: THSCaptchTypeEnum.ljqs,
  },
};

/**
 * 获取当前页面的总页数
 * @param page
 * @returns
 */
export const getCurrentTotalPage = async (page: Page) => {
  const pageInfo = await page.waitForSelector(PAGE_INFO_SELECTOR).then((pageInfoHandle) => {
    return pageInfoHandle?.evaluate((node) => node.textContent);
  });
  if (pageInfo) {
    const totalPage = Number(pageInfo.split("/")[1]);
    return totalPage;
  } else {
    return 0;
  }
};
/**
 * 获取爬取页面当前数据的日期
 * @param page
 * @returns
 */
export const getCurrentDate = async (page: Page) => {
  const [element] = await page.$x(CURRENT_DATE_XPATH);
  const text = await page.evaluate((node) => node.textContent, element);
  const split = text?.trim().split("：");
  return split ? split[1] : "";
};
/**
 * 获取每页的数据
 * @param page
 * @returns
 */
export const getEveryPageInfo = async (page: Page) => {
  const data = await page.waitForSelector(TARGET_TABLE_SELECTOR).then(async () => {
    const list: string[] = [];
    const tbody = await page.$(TARGET_TABLE_SELECTOR);
    const trs = await tbody?.$$("tr");
    if (trs) {
      for await (const tr of trs) {
        const tds = await tr.$$eval("td", (tds) => tds.map((td) => td.innerText.trim()));
        list.push(tds.join(","));
      }
    }
    return list;
  });
  return data;
};
/**
 * 当前页数
 * @param page
 * @returns
 */
export const getCurrentPageNumber = async (page: Page) => {
  return await page.waitForSelector(TARGET_TABLE_SELECTOR).then(async () => {
    const currPage = await page.$eval(CURRENT_PAGE_SELECTOR, (node) => node.textContent);
    return Number(currPage);
  });
};
/**
 * 模拟用户点击下一页
 * @param totalPage
 * @param page
 * @returns
 */
export const activeLoopNextPage = (totalPage: number, page: Page) => {
  return new Promise<boolean>(async (resolve) => {
    if (totalPage <= 0) {
      return resolve(false);
    }
    const timer = setInterval(async () => {
      const currPage = await getCurrentPageNumber(page);
      const xpaths = await page.$x(NEXT_PAGE_XPATH);
      const nextHandle = xpaths[0] ? xpaths[0] : null;
      if (nextHandle) {
        await nextHandle.click({ delay: 10 });
      }
      if (currPage >= totalPage) {
        clearInterval(timer);
        resolve(true);
      }
    }, 1000);
  });
};
/**
 * 开始捕获数据
 * @param url
 * @param type
 * @returns
 */
export const startCapture = (url: string, type: THSCaptchTypeEnum) => {
  logger.info(`开始爬取：${url} ${type}`);
  return new Promise<LiangJiaStock[]>(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    try {
      let totalPage = 0;
      let currentDate = "";
      let dataMap = new Map<string, string[]>();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
      );
      await page.setExtraHTTPHeaders({
        DNT: "1",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
      });
      await page.setViewport({ width: 1900, height: 900 });
      page.on("response", async (res) => {
        if (res.url().includes(url)) {
          const currPage = await getCurrentPageNumber(page);
          if (!currPage) return;
          if (dataMap.has(String(currPage))) return;
          const data = await getEveryPageInfo(page);
          dataMap.set(String(currPage), data);
          console.log("页数： ", currPage, totalPage);
          if (currPage < totalPage) {
            logger.info(`开始爬取：${url} ${type} - 正在爬取${currPage}页`);
          } else {
            logger.info(`开始爬取：${url} ${type} - 结束了`);
            resolve(converArrayToLiangJia(convertMapToArray(dataMap), type, currentDate));
          }
        }
      });

      /**
       * 这里很关键
       *
       * 同花顺使用puppeteer的反扒机制，目前暂不清楚什么原理，根据资料，一般是针对webdriver进行设置
       * 所以当前阶段是在页面导航、创建文档后运行任何脚本之前调用
       *
       * 在当前方法下，我们去修改同花顺网页的webdriver
       * 另一个参数doNotTrack是比对了正常浏览器和puppeteer内置浏览器的navigator两者之间存在的字段差异。
       * 之后添加的，似乎没有任何作用，暂时先保留
       */
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => undefined });
        Object.defineProperty(navigator, "doNotTrack", { get: () => "1" });
      });
      await page.goto(url, { waitUntil: "load" });
      totalPage = await getCurrentTotalPage(page);
      currentDate = await getCurrentDate(page);
      console.log("a xi ba: ", currentDate, totalPage);
      // 不能用for循环做，否则会报错，使用定时器做
      if (totalPage > 0) {
        await activeLoopNextPage(totalPage, page);
        // resolve(`成功获取${totalPage}页数据`);
        // resolve(Object.fromEntries(dataMap));
      } else {
        reject("没有可以爬取的数据");
      }
      // await page.screenshot({ path: `ths-${Date.now()}.png`, fullPage: true });
      setTimeout(async () => {
        await page.close();
        await browser.close();
      }, 10000);
    } catch (error) {
      reject("获取失败");
      throw error;
    }
  });
};
