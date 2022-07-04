"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initJiuCaiGongSheJob = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const hot_1 = require("./hot");
const jiucaigongshe_1 = require("../../mongodb/actions/jiucaigongshe");
const model_1 = require("../../mongodb/model");
const hot_2 = require("../../mongodb/schema/jiucaigongshe/hot");
const logger_1 = require("../../middleware/logger");
const logger = (0, logger_1.createLogger)("JiuCaiGongSheLog-Auto");
async function getLast60DayActionData() {
    for await (const v of Array.from({ length: 60 }, (_, index) => index)) {
        const date = (0, dayjs_1.default)().subtract(v, "day").format("YYYY-MM-DD");
        const CategoryModel = mongoose_1.default.model(model_1.t_jcgs_category, hot_2.CategorySchema);
        const count = await CategoryModel.find({ day: date }).count();
        if (count) {
            logger.info(`自动化任务抓取${date}异动数据已经存在！`);
            continue;
        }
        const data = await (0, hot_1.getDailyAction)(date);
        if (data.day) {
            await (0, jiucaigongshe_1.insertHot)(data.categorys, data.day);
        }
    }
}
async function scheduleforEveryDayAction() {
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.second = 0;
    rule.minute = 45;
    rule.hour = 15;
    rule.dayOfWeek = [1, 2, 3, 4, 5, 6];
    node_schedule_1.default.scheduleJob(rule, async () => {
        const date = (0, dayjs_1.default)().format("YYYY-MM-DD");
        const CategoryModel = mongoose_1.default.model(model_1.t_jcgs_category, hot_2.CategorySchema);
        const count = await CategoryModel.find({ day: date }).count();
        if (count) {
            return;
        }
        const data = await (0, hot_1.getDailyAction)(date);
        if (data.day) {
            logger.info(`定时任务抓取了${date}的数据`);
            await (0, jiucaigongshe_1.insertHot)(data.categorys, data.day);
        }
    });
}
function initJiuCaiGongSheJob() {
    scheduleforEveryDayAction();
}
exports.initJiuCaiGongSheJob = initJiuCaiGongSheJob;
