import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { generateTicket, rmTicket } from "@/works/ticket/index";
import send from "koa-send";
import dateTool from "@/lib/date";

const router = new Router<DefaultState, Context>();

type DateList = { dateList?: string[] };
// 生成两个范围之间的数
function getRandomArbitrary(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min);
}
// 获取指定的时间
function formatDate(dateString: string): string {
  const hour = getRandomArbitrary(18, 21);
  const minute = getRandomArbitrary(0, 59);
  const second = getRandomArbitrary(0, 59);
  return `${dateTool.format(dateString)} ${hour}:${minute < 10 ? "0" + minute : minute}:${
    second < 10 ? "0" + second : second
  }`;
}

router.post("/generate", async (ctx) => {
  const { dateList }: DateList = ctx.request.body;
  if (!dateList || !dateList.length) {
    ctx.error("请选择上传日期");
    return;
  }
  const list = dateList.map((item) => formatDate(item));
  const result = await generateTicket(list);
  if (result) {
    const zipPath = "static/tickets.zip";
    ctx.attachment(zipPath);
    const result = await send(ctx, zipPath, { root: process.cwd() });
    if (result) {
      rmTicket();
    }
  } else {
    ctx.error("下载失败，请重试，去查看log吧");
  }
});
router.get("/generate", async (ctx) => {
  let { dateList }: { dateList?: string } = ctx.request.query;
  if (!dateList || !dateList.length) {
    ctx.error("请选择上传日期");
    return;
  }
  const list = dateList.split(",").map((str) => formatDate(str));
  console.log(list);
  const result = await generateTicket(list);
  if (result) {
    const zipPath = "static/tickets.zip";
    ctx.attachment(zipPath);
    const result = await send(ctx, zipPath, { root: process.cwd() });
    if (result) {
      rmTicket();
    }
  } else {
    ctx.error("下载失败，请重试，去查看log吧");
  }
});

export default router;
