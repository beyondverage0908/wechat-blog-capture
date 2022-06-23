import { DefaultState, Context } from "koa";
import Router from "koa-router";
import axios from "axios";
import CheerioUtil from "@/util/cheerio";

const router = new Router<DefaultState, Context>();

router.get("/capture", async (ctx) => {
  const { url } = ctx.query;
  const data = await axios.get(url as string);
  const c = new CheerioUtil(data.data);
  const selector = c.getValueBySelector("#js_content");
  ctx.body = {
    info: selector.text(),
  };
});

router.get("/capture/:id", (ctx) => {
  ctx.body = ctx.params;
});

export default router;
