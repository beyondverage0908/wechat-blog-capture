import Router from "koa-router";
import axios from "axios";
import cheerio from "@/util/cheerio";

const router = new Router();

router.get("/capture", async (ctx) => {
  const { url } = ctx.query;
  const data = await axios.get(url as string);
  const text = cheerio.getText(data.data);
  ctx.body = {
    info: text.trim(),
  };
});

router.get("/capture/:id", (ctx) => {
  ctx.body = ctx.params;
});

export default router;
