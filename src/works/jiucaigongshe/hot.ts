import axios from "axios";
import dayjs from "dayjs";
import puppeteer from "puppeteer";
import {
  countPcUrl,
  getActionUrl,
  mainUrl,
} from "@/constant/urls/jiucaigongshe";
import date from "@/lib/date";
import { createLogger } from "@/middleware/logger";
const logger = createLogger("jiucaigongshe-hot");

export async function getActionPage() {
  const data = await axios.get(getActionUrl());
  console.log(data.data);
}

export const getMainPage = async () => {
  // const data = await axios.get(mainUrl);
  // console.log(data.data);
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    // console.log("--->>> ", request.resourceType(), request.url());
    request.continue();
  });
  page.on("response", (response) => {
    if (response.request().resourceType() === "xhr") {
      console.log("+++>>> ", response.request().resourceType(), response.url());
      response.json().then((res) => {
        console.log("===>>> ", res);
      });
    }
  });
  const actionUrl = getActionUrl();
  console.log("actionUrl: ", actionUrl);
  await page.goto(actionUrl, { waitUntil: "load" });
  try {
    await page.click(".yd-tabs_item", { delay: 10 });
    // await page.click(".jc-bline", { delay: 300 });
  } catch (error) {
    console.error(error);
    logger.error(JSON.stringify(error));
  }

  const resultsSelector = ".module .sort-box .fs18-bold";
  // 浏览器的上下文中执行js代码
  const result = await page.evaluate((resultsSelector) => {
    const modules = Array.from(document.querySelectorAll(resultsSelector));
    return {
      modules,
    };
  }, resultsSelector);

  result.modules.forEach((element) => {
    console.log(element.textContent);
  });

  // 浏览器截屏
  await page.screenshot({
    path: `screenshot-${Date.now()}.png`,
    fullPage: true,
  });

  // 浏览器保存未pdf
  // await page.pdf({
  //   path: `pdf-${Date.now()}.pdf`,
  //   format: "A2",
  // });

  await page.close();
  await browser.close();
};

export async function getCurrentHots() {
  const data = await axios.post(
    countPcUrl,
    { date: dayjs().format("YYYY-MM-DD") },
    {
      headers: {
        "content-type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
        cookie:
          "Hm_lvt_2d6d056d37910563cdaa290ee2981080=1655699263,1655719137; SESSION=MGNiOGQ2MzgtMTFhNi00YzllLTkxYjktMjFmZjc5OTA5ZWFj; Hm_lpvt_2d6d056d37910563cdaa290ee2981080=1656131287",
        origin: "https://www.jiucaigongshe.com",
        referer: "https://www.jiucaigongshe.com/",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      },
    }
  );
}

export async function optionsPcCount() {
  const data = await axios.options(countPcUrl);
  getCurrentHots();
  console.log(data);
}
