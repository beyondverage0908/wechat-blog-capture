"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveHqData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const eastmoney_1 = require("../schema/eastmoney");
const model_1 = require("../model");
const logger_1 = require("../../middleware/logger");
const dayjs_1 = __importDefault(require("dayjs"));
const logger = (0, logger_1.createLogger)("Eastmoney-Action");
const insertHqData = async (hqList, day) => {
    const HqStockModel = mongoose_1.default.model(model_1.t_em_hq, eastmoney_1.HqSchema);
    const result = await HqStockModel.insertMany(hqList.map((item) => ({
        day: day,
        name: item.name,
        change: item.change ? Number(item.change) : null,
        percent: item.percent && item.percent.includes("%")
            ? Number(item.percent.replace("%", ""))
            : null,
        time: (0, dayjs_1.default)().format("HH:mm:ss"),
    })));
    return result;
};
const saveHqData = async (hqList, day) => {
    logger.info("准备存储数据");
    const HqStockModel = mongoose_1.default.model(model_1.t_em_hq, eastmoney_1.HqSchema);
    const count = await HqStockModel.find({ day: day }).count();
    if (!count) {
        await insertHqData(hqList, day);
        logger.info("准备存储数据（新增）-完成");
        return true;
    }
    else {
        const result = await HqStockModel.deleteMany({ day });
        if (result.acknowledged) {
            await insertHqData(hqList, day);
            logger.info("准备存储数据（更新）-完成");
            return true;
        }
    }
    return false;
};
exports.saveHqData = saveHqData;
