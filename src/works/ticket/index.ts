import path from "path";
import fs from "fs";
import JSZIP from "jszip";
import dayjs from "dayjs";
import puppeteer from "puppeteer";
import { devices } from "puppeteer";
import rimraf from "rimraf";
import { generateShopUrl, generateWechatUrl } from "@/constant/urls/ticket";
import { createLogger } from "@/middleware/logger";
const logger = createLogger("TicketLog");

/**
 * 删除文件
 */
export function rmTicket() {
  rimraf(path.resolve(process.cwd(), "static/tickets"), (err) => {
    if (err) throw err;
    logger.info("删除tickets成功");
  });
  rimraf(path.resolve(process.cwd(), "static/tickets.zip"), (err) => {
    if (err) throw err;
    logger.info("删除tickets.zip成功");
  });
}

function zipTicket() {
  return new Promise<boolean>((resovle, reject) => {
    logger.info("开始打包发票");
    const zip = new JSZIP();
    const zipFloderUrl = path.resolve(process.cwd(), "static/tickets");
    pushZip(zip, zipFloderUrl);
    zip
      .generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      })
      .then(function (content) {
        fs.writeFile(
          path.resolve(process.cwd(), "./static/tickets.zip"),
          content,
          (err) => {
            if (err) {
              reject(err);
              throw err;
            }
            logger.info("文件已被保存");
            resovle(true);
          }
        );
      });

    function pushZip(floder: JSZIP, pPath: string) {
      const files = fs.readdirSync(pPath, { withFileTypes: true });
      files.forEach((dirent, index) => {
        let filePath = `${pPath}/${dirent.name}`;
        if (dirent.isDirectory()) {
          let zipFloder = zip.folder(
            filePath.replace(`${process.cwd()}\\static\\tickets/`, "")
          );
          pushZip(zipFloder!, filePath);
        } else {
          floder.file(dirent.name, fs.readFileSync(filePath));
        }
      });
    }
  });
}

export const generateTicket = async (dateList: string[]) => {
  logger.info("开始准备生成小票图片");
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
    args: ["--no-sandbox"],
  });

  const dir = path.resolve(process.cwd(), "static/tickets");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for await (const date of dateList) {
    const index = dateList.indexOf(date);
    const page = await browser.newPage();
    // await page.setViewport({ width: 375, height: 667 });
    // 利用puppeteer内置的模拟器
    await page.emulate(devices["iPhone 6"]);
    const url =
      index % 2 === 1
        ? generateShopUrl({ shopTime: date })
        : generateWechatUrl({ shopTime: date });
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    await page.screenshot({
      path: `${path.resolve(dir, dayjs(date).format("YYYY-MM-DD") + ".png")}`,
      fullPage: true,
    });
    await page.close();
  }
  await browser.close();
  const is = await zipTicket();
  logger.info("结束生成小票图片");
  return is;
};
