"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const hot_1 = require("../../works/jiucaigongshe/hot");
const jiucaigongshe_1 = require("../../works/jiucaigongshe");
const action_1 = require("../../mongodb/jiucaigongshe/action");
const date_1 = __importDefault(require("../../lib/date"));
const router = new koa_router_1.default();
router.get("/hot/:day", async (ctx) => {
    const { day } = ctx.params;
    const currentDay = date_1.default.format();
    const data = await (0, hot_1.getDailyAction)(day || currentDay);
    await (0, action_1.updateHot)(data.categorys, data.day);
    if (data.success === false) {
        ctx.error(data.message);
    }
    else {
        ctx.success(data);
    }
});
router.get("/today", async (ctx) => {
    const today = date_1.default.format();
    const isSuccess = await (0, jiucaigongshe_1.updateTargetDayAction)(today);
    if (isSuccess === false) {
        ctx.error("触发爬取失败");
    }
    else {
        ctx.success("触发爬取成功");
    }
});
router.get("/action", async (ctx) => {
    const { startDate, endDate } = ctx.query;
    if (!startDate || !endDate) {
        ctx.error("时间范围必填");
        return;
    }
    const dateRange = date_1.default.range(startDate, endDate);
    const result = await (0, action_1.queryActionOfRange)(dateRange);
    const map = new Map();
    result.forEach((item) => {
        const hasCategory = map.has(item.category);
        if (!hasCategory) {
            map.set(item.category, item);
        }
        else {
            const preItem = map.get(item.category);
            preItem.number += item.number;
            preItem.stocks = preItem.stocks.concat(item.stocks);
        }
    });
    const sortArray = Array.from(map.values()).sort((a, b) => b.number - a.number);
    ctx.success(sortArray);
});
exports.default = router;
