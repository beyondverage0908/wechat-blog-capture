import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getHq } from "@/works/eastmoney/hq";
import { saveHqData } from "@/mongodb/eastmoney/hangqing";
import DateTool from "@/lib/date";
const router = new Router<DefaultState, Context>();

router.get("/hq", async (ctx) => {
  const hqList = await getHq();
  const today = DateTool.format();
  console.log(today);
  // 触发写库操作
  await saveHqData(hqList, today);
  ctx.success(hqList);
});

export default router;
