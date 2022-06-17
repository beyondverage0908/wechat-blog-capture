import Router from "koa-router";

const home = new Router();

home.get("/", async (ctx) => {
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `;
  ctx.body = html;
});

home.get("/hello", (ctx) => {
  ctx.body = "hello world";
});

home.get("/json", (ctx) => {
  console.log(ctx.query);
  ctx.body = {
    name: "xiaoli",
  };
});

export default home;
