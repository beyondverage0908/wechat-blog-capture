"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("../../util/cheerio"));
const router = new koa_router_1.default();
router.get("/capture", async (ctx) => {
    const { url } = ctx.query;
    const data = await axios_1.default.get(url);
    const c = new cheerio_1.default(data.data);
    const selector = c.getValueBySelector("#js_content");
    ctx.body = {
        info: selector.text(),
    };
});
router.get("/capture/:id", (ctx) => {
    ctx.body = ctx.params;
});
exports.default = router;
