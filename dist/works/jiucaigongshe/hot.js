"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyAction = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const jiucaigongshe_1 = require("../../constant/urls/jiucaigongshe");
const dayjs_1 = __importDefault(require("dayjs"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(isBetween_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
const getDailyAction = async (queryDay) => {
    const inLast60 = (0, dayjs_1.default)(queryDay).isBetween((0, dayjs_1.default)().subtract(60, "day"), (0, dayjs_1.default)());
    if (!inLast60) {
        return {
            success: false,
            message: "只能获取最近60天的数据",
        };
    }
    const browser = await puppeteer_1.default.launch({
        headless: true,
        devtools: false,
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    const actionUrl = (0, jiucaigongshe_1.getActionUrl)(queryDay);
    await page.goto(actionUrl, { waitUntil: "load" });
    await page.click(".yd-tabs_item", { delay: 10 });
    const targetSelector = "ul li.module";
    const data = await page.waitForSelector(targetSelector).then(async () => {
        const elements = await page.$$eval(targetSelector, (links) => {
            const categoryList = links.map((ele) => {
                var _a, _b, _c, _d;
                const category = {
                    category: (_b = (_a = ele
                        .querySelector(".sort-box .fs18-bold.lf")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim(),
                    number: (_d = (_c = ele
                        .querySelector(".sort-box .number.lf")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim(),
                };
                category.stocks = Array.from(ele.querySelectorAll("ul.td-box li.row")).map((stockEle) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                    return {
                        name: (_b = (_a = stockEle.querySelector(".fs15-bold")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim(),
                        code: (_d = (_c = stockEle.querySelector(".fs12-bold-ash")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim(),
                        price: (_f = (_e = stockEle
                            .querySelector(".shrink.number")) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim(),
                        percent: (_h = (_g = stockEle
                            .querySelector(".shrink.cred")) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim(),
                        time: (_k = (_j = stockEle.querySelector(".shrink.fs15")) === null || _j === void 0 ? void 0 : _j.textContent) === null || _k === void 0 ? void 0 : _k.trim(),
                        desc: (_m = (_l = stockEle.querySelector("pre.tl a")) === null || _l === void 0 ? void 0 : _l.textContent) === null || _m === void 0 ? void 0 : _m.trim(),
                        descLink: `${"https://www.jiucaigongshe.com"}${(_o = stockEle
                            .querySelector("pre.tl a")) === null || _o === void 0 ? void 0 : _o.getAttribute("href")}`,
                    };
                });
                return category;
            });
            return categoryList.filter((item) => !!item.category);
        });
        const inputHandle = await page.$(".date-box input");
        const date = await page.evaluate((el) => el.value, inputHandle);
        const year = (0, dayjs_1.default)(queryDay).year();
        const month = (0, dayjs_1.default)(`${year}年${date}`, "HHHH年MM月DD日").month();
        const day = (0, dayjs_1.default)(`${year}年${date}`, "HHHH年MM月DD日").date();
        await page.close();
        await browser.close();
        return {
            day: (0, dayjs_1.default)().year(year).month(month).date(day).format("YYYY-MM-DD"),
            elements,
        };
    });
    return {
        day: data.day,
        categorys: data.elements || [],
    };
};
exports.getDailyAction = getDailyAction;
