import axios from "axios";
import puppeteer from "puppeteer";
import { getActionUrl } from "@/constant/urls/jiucaigongshe";
import { Dictionary } from "@/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import date from "@/lib/date";
import { insertHot } from "@/mongodb/actions/jiucaigongshe";
dayjs.extend(isBetween);

export async function getActionPage() {
  const data = await axios.get(getActionUrl());
  console.log(data.data);
}

export const getDailyAction = async (queryDay: string) => {
  // 是否是最近30天
  const inLast30 = dayjs(queryDay).isBetween(
    dayjs().subtract(30, "day"),
    dayjs()
  );
  if (!inLast30) {
    return {
      success: false,
      message: "只能获取最近30天的数据",
    };
  }
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  const actionUrl = getActionUrl(queryDay);
  await page.goto(actionUrl, { waitUntil: "load" });

  await page.waitForSelector(".module-box.jc0").then(() => {
    console.log("waitForSelector be call!!", actionUrl);
  });

  const resultsSelector = "ul li.module";
  // 通过选择器获取元素
  const elements = await page.$$eval(resultsSelector, (links) => {
    const categoryList = links.map((ele) => {
      const category: Dictionary = {
        category: ele
          .querySelector(".sort-box .fs18-bold.lf")
          ?.textContent?.trim(),
        number: ele.querySelector(".sort-box .number.lf")?.textContent?.trim(),
      };
      category.stocks = Array.from(
        ele.querySelectorAll("ul.td-box li.row")
      ).map((stockEle) => {
        return {
          name: stockEle.querySelector(".fs15-bold")?.textContent?.trim(),
          code: stockEle.querySelector(".fs12-bold-ash")?.textContent?.trim(),
          price: stockEle.querySelector(".shrink.number")?.textContent?.trim(),
          percent: stockEle.querySelector(".shrink.cred")?.textContent?.trim(),
          time: stockEle.querySelector(".shrink.fs15")?.textContent?.trim(),
          desc: stockEle.querySelector("pre.tl a")?.textContent?.trim(),
          descLink: `${"https://www.jiucaigongshe.com"}${stockEle
            .querySelector("pre.tl a")
            ?.getAttribute("href")}`,
        };
      });
      return category;
    });
    return categoryList.filter((item) => !!item.category);
  });

  // 浏览器截屏
  // await page.screenshot({
  //   path: `screenshot-${Date.now()}.png`,
  //   fullPage: true,
  // });

  // 浏览器保存未pdf
  // await page.pdf({
  //   path: `pdf-${Date.now()}.pdf`,
  //   format: "A2",
  // });

  await page.close();
  await browser.close();

  const day = date.format(queryDay);
  insertHot(elements, day);

  return {
    day: date.format(queryDay),
    data: elements,
  };
};

export async function getCurrentHots() {}

export async function optionsPcCount() {}
