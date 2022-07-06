import axios from "axios";
import * as cheerio from "cheerio";
import { mainUrl } from "@/constant/urls/eastmoney";
import { HqStock } from "@/types/eastmoney";

export const getHq = async () => {
  const data = await axios.get(mainUrl);
  const html = data.data;
  const $ = cheerio.load(html);
  const children = $("#hq-news-main .hq-news-con .hq-news-data");
  const hqList: HqStock[] = [];
  children.each(function (_, ele) {
    const data: HqStock = { name: "", price: "", change: "", percent: "" };
    data.name = $(ele).find(".nickname").text();
    $(ele)
      .find(".hq-news-value")
      .contents()
      .each((idx, element) => {
        if (idx === 0) {
          data.price = $(element).text();
        } else if (idx === 1) {
          data.change = $(element).text();
        } else if (idx === 2) {
          data.percent = $(element).text();
        }
      });
    hqList.push(data);
  });
  return hqList;
};
