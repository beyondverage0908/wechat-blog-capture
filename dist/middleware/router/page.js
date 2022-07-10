"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
let page = new koa_router_1.default();
page
    .get("/404", async (ctx) => {
    ctx.body = "404 page!";
})
    .get("/helloworld", async (ctx) => {
    ctx.body = "helloworld page!";
});
exports.default = page;
