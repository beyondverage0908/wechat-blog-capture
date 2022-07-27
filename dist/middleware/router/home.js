"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const home = new koa_router_1.default();
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
exports.default = home;
