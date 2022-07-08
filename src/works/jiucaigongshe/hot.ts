import puppeteer from "puppeteer";
import { getActionUrl } from "@/constant/urls/jiucaigongshe";
import { Dictionary } from "@/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { insertHot } from "@/mongodb/jiucaigongshe/action";
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

/**
 * 获取韭菜公社某日的异动数据
 * @param queryDay
 * @returns
 */
export const getDailyAction = async (queryDay: string) => {
  // 是否是最近60天
  const inLast60 = dayjs(queryDay).isBetween(
    dayjs().subtract(60, "day"),
    dayjs()
  );
  if (!inLast60) {
    return {
      success: false,
      message: "只能获取最近60天的数据",
    };
  }
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
    // ref: https://github.com/puppeteer/puppeteer/issues/3698
    // 为了在centeos上用root用户可以启动
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });

  const actionUrl = getActionUrl(queryDay);
  await page.goto(actionUrl, { waitUntil: "load" });
  // 模拟用户点击
  await page.click(".yd-tabs_item", { delay: 10 });
  // 等待界面中某个选择器出现才进行数据爬取，这个特别方便对异步渲染的爬取
  const targetSelector = "ul li.module";
  const data = await page.waitForSelector(targetSelector).then(async () => {
    // 通过选择器获取元素
    const elements = await page.$$eval(targetSelector, (links) => {
      const categoryList = links.map((ele) => {
        const category: Dictionary = {
          category: ele
            .querySelector(".sort-box .fs18-bold.lf")
            ?.textContent?.trim(),
          number: ele
            .querySelector(".sort-box .number.lf")
            ?.textContent?.trim(),
        };
        category.stocks = Array.from(
          ele.querySelectorAll("ul.td-box li.row")
        ).map((stockEle) => {
          return {
            name: stockEle.querySelector(".fs15-bold")?.textContent?.trim(),
            code: stockEle.querySelector(".fs12-bold-ash")?.textContent?.trim(),
            price: stockEle
              .querySelector(".shrink.number")
              ?.textContent?.trim(),
            percent: stockEle
              .querySelector(".shrink.cred")
              ?.textContent?.trim(),
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
    // 获取页面上的日期
    const inputHandle = await page.$(".date-box input");
    const date = await page.evaluate((el: any) => el.value, inputHandle);
    const year = dayjs(queryDay).year();
    // month返回的数据是0-11
    const month = dayjs(`${year}年${date}`, "HHHH年MM月DD日").month();
    const day = dayjs(`${year}年${date}`, "HHHH年MM月DD日").date();
    await page.close();
    await browser.close();
    // ${year}-${month}-${day}
    return {
      day: dayjs().year(year).month(month).date(day).format("YYYY-MM-DD"),
      elements,
    };
  });

  return {
    day: data.day,
    categorys: data.elements || [],
  };
};
