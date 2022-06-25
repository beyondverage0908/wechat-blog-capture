import axios from "axios";
import dayjs from "dayjs";
import puppeteer from "puppeteer";
import {
  countPcUrl,
  getActionUrl,
  mainUrl,
} from "@/constant/urls/jiucaigongshe";

export async function getActionPage() {
  const data = await axios.get(getActionUrl());
  console.log(data.data);
}

export const getMainPage = async () => {
  // const data = await axios.get(mainUrl);
  // console.log(data.data);
  console.log(puppeteer);
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
  });
  const page = await browser.newPage();
  await page.goto(mainUrl);
  const result = await page.evaluate((target) => {
    console.log(target);
  }, mainUrl);

  console.log("--->> ", result);

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
