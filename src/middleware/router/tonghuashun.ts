import { DefaultState, Context } from "koa";
import Router from "koa-router";
import puppeteer from "puppeteer";

const router = new Router<DefaultState, Context>();

router.get("/ljqd", async (ctx) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
    );
    // cookie似乎是必须的
    await page.setCookie({
      name: "v",
      value: "AyJ8EXPjtLqeJah4-IrHEmVodaOBcyY_2HcasWy5ThVAP8xdVAN2nagHa8M_",
      domain: ".10jqka.com.cn",
      path: "/",
    });
    await page.goto(
      "http://data.10jqka.com.cn/rank/ljqd/field/count/order/desc/ajax/1/free/1/page/1/free/1/",
      { waitUntil: "networkidle2" }
    );
    await page.screenshot({ path: "xxxx.png", fullPage: true });
    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
    ctx.error("获取失败");
  }
});

export default router;
