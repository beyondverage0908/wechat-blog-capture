"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initJiuCaiGongSheJob = exports.updateTargetDayAction = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const hot_1 = require("./hot");
const action_1 = require("../../mongodb/jiucaigongshe/action");
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
            await (0, action_1.insertHot)(data.categorys, data.day);
        }
    }
}
async function scheduleforEveryDayAction() {
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.second = 0;
    rule.minute = 35;
    rule.hour = [12, 15];
    rule.dayOfWeek = [1, 2, 3, 4, 5];
    node_schedule_1.default.scheduleJob(rule, async () => {
        const date = (0, dayjs_1.default)().format("YYYY-MM-DD");
        logger.info(`定时任务开始抓取${date}数据`);
        await updateTargetDayAction(date);
        logger.info(`定时任务抓取了${date}的数据-结束`);
    });
}
async function updateTargetDayAction(day) {
    logger.info(`触发任务开始抓取${day}数据`);
    const data = await (0, hot_1.getDailyAction)(day);
    if (data.success === false) {
        return false;
    }
    const CategoryModel = mongoose_1.default.model(model_1.t_jcgs_category, hot_2.CategorySchema);
    const count = await CategoryModel.find({ day: day }).count();
    if (count) {
        const result = await (0, action_1.updateHot)(data.categorys, data.day);
        logger.info(`触发任务抓取了${data.day}的数据-更新-结束`);
        return result;
    }
    else {
        const result = await (0, action_1.insertHot)(data.categorys, data.day);
        logger.info(`触发任务抓取了${data.day}的数据-新增-结束`);
        return result;
    }
}
exports.updateTargetDayAction = updateTargetDayAction;
function initJiuCaiGongSheJob() {
    scheduleforEveryDayAction();
}
exports.initJiuCaiGongSheJob = initJiuCaiGongSheJob;
