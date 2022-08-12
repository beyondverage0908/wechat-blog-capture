import { DefaultState, Context } from "koa";
import Router from "koa-router";
import { getCurrentPrice, getGroupStockPrice } from "@/works/stock/price";
import { updateLiangJiaTargetMonitPrice } from "@/mongodb/tonghuashun/liangjia";

const router = new Router<DefaultState, Context>();

/**
 * 获取单只股票价格
 */
router.get("/price", async (ctx) => {
  const { code } = ctx.request.query;
  const price = await getCurrentPrice(code as string);
  ctx.success(price);
});
/**
 * 批量获取当前股票价格
 */
router.get("/prices", async (ctx) => {
  const { codes } = ctx.request.query;
  if (!codes || !codes.length) {
    ctx.error("没有证券代码");
    return;
  }
  const inputCodes = (codes as string).split(",");
  const prices = await getGroupStockPrice(inputCodes);
  ctx.success(prices);
});

export default router;
