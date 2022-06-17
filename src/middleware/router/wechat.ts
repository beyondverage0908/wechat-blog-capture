import Router from "koa-router";
import axios from "axios";
import cheerio from "@/util/cheerio";

const router = new Router();

router.get("/capture", async (ctx) => {
  const { url } = ctx.query;
  const data = await axios.get(url as string);
  cheerio.getText(data.data);
  ctx.body = data.data;
});

router.get("/capture/:id", (ctx) => {
  ctx.body = ctx.params;
});

export default router;
