import puppeteer, { Browser } from "puppeteer";

/**
 * 创建一个页面
 * @param browser
 * @returns
 */
export async function createPage(browser: Browser) {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    DNT: "1",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
  });
  await page.setViewport({ width: 1900, height: 900 });
  /**
   * 这里很关键
   *
   * 某些页面会使用puppeteer的反扒机制，目前暂不清楚什么原理，根据资料，一般是针对webdriver进行设置
   * 所以当前阶段是在页面导航、创建文档后运行任何脚本之前调用
   *
   * 例如
   * 在当前方法下，我们去修改同花顺网页的webdriver
   * 另一个参数doNotTrack是比对了正常浏览器和puppeteer内置浏览器的navigator两者之间存在的字段差异。
   * 之后添加的，似乎没有任何作用，暂时先保留
   */
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    Object.defineProperty(navigator, "doNotTrack", { get: () => "1" });
  });
  return page;
}

/**
 * 创建一个默认浏览器
 * @returns
 */
export async function createPuppeteer() {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
    args: ["--no-sandbox"],
  });
  const page = await createPage(browser);
  return {
    browser,
    page,
  };
}
