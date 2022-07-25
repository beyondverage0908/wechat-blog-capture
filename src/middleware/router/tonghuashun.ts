import { DefaultState, Context } from "koa";
import Router from "koa-router";
import puppeteer from "puppeteer";
import { Protocol } from "puppeteer";

const router = new Router<DefaultState, Context>();

router.get("/ljqd", async (ctx) => {
  console.log("get start");
  const targetSelector = "#J-ajax-main .J-ajax-table tbody";
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
    );
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.url().includes("http://data.10jqka.com.cn/rank/ljqd/field/count")) {
        const headers = req.headers();
        const cookie = headers["cookie"];
        console.log(req.url(), req.method(), req.resourceType(), req.headers());
        console.log(headers["cookie"]);
        if (cookie) {
          const settingCookies: Protocol.Network.Cookie[] = [];
          cookie.split(";").forEach((kvalue) => {
            const values = kvalue.split("=");
            const c = {
              name: values[0],
              value: values[1],
            } as Protocol.Network.Cookie;
            settingCookies.push(c);
          });
          page.setCookie(...settingCookies);
        }
      }
      req.continue();
    });
    page.on("requestfinished", async (req) => {
      // if (req.url().includes("http://data.10jqka.com.cn/rank/ljqd/field/count")) {
      //   const headers = req.headers();
      //   const cookie = headers["cookie"];
      //   console.log(req.url(), req.method(), req.resourceType(), req.headers());
      //   console.log(headers["cookie"]);
      // }
    });
    await page.goto("http://data.10jqka.com.cn/rank/ljqd/", { waitUntil: "networkidle2" });
    const pageInfo = await page.waitForSelector(".J-ajax-page .page_info").then((pageInfoHandle) => {
      return pageInfoHandle?.evaluate((node) => node.textContent);
    });
    let allPage = 0;
    if (pageInfo) {
      allPage = Number(pageInfo.split("/")[1]);
    }
    for await (const v of Array.from({ length: allPage }, (_, idx) => idx + 1)) {
      // const data = await page.waitForSelector(targetSelector).then(async () => {
      //   const list: string[][] = [];
      //   const tbody = await page.$("#J-ajax-main .J-ajax-table tbody");
      //   const trs = await tbody?.$$("tr");
      //   if (trs) {
      //     for await (const tr of trs) {
      //       const tds = await tr.$$eval("td", (tds) => tds.map((td) => td.innerText.trim()));
      //       list.push(tds);
      //     }
      //   }
      //   return list;
      // });
      // const nextPageHandles = await page.$$(".J-ajax-page .changePage");
      // const nextPageHandle = nextPageHandles.find((handle) => handle.evaluate((node) => node.textContent === "下一页"));
      // const currPage = await page.evaluate((node) => node?.getAttribute("page"), nextPageHandle);
      // console.log(currPage);
      // await nextPageHandle?.click({ delay: 3 });
      // const xpaths = await page.$x("//*[@id='J-ajax-main']/div/a[contains(., '下一页')]");
      // console.log(data[0]);
      // const currPage = await page.evaluate((node) => node?.getAttribute("page"), xpaths[0]);
      // console.log(currPage);
    }
    await page.setViewport({ width: 1900, height: 900 });
    await page.screenshot({ path: `ths-${Date.now()}.png`, fullPage: true });
    await page.close();
    await browser.close();
    ctx.success("成功");
  } catch (error) {
    console.log(error);
    ctx.error("获取失败");
    throw error;
  }
});

export default router;
