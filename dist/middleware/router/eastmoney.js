"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const hq_1 = require("../../works/eastmoney/hq");
const router = new koa_router_1.default();
router.get("/hq", async (ctx) => {
    const hqList = await (0, hq_1.getHq)();
    ctx.success(hqList);
});
exports.default = router;
