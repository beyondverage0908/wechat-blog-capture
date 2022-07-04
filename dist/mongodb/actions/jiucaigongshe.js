"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHot = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const hot_1 = require("../schema/jiucaigongshe/hot");
const model_1 = require("../model");
const logger_1 = require("../../middleware/logger");
const logger = (0, logger_1.createLogger)("JiuCaiGongShe-Actions");
const insertStocks = async (stocks, categoryId) => {
    if (!stocks)
        return;
    const StockModel = mongoose_1.default.model(model_1.t_jcgs_stock, hot_1.StockSchema);
    await StockModel.insertMany(stocks.map((item) => ({
        ...item,
        desc_link: item.descLink,
        category_id: categoryId,
    })));
};
const insertCategory = async (category, day) => {
    if (!category)
        return;
    const CategoryModel = mongoose_1.default.model(model_1.t_jcgs_category, hot_1.CategorySchema);
    const categoryInstance = new CategoryModel({ ...category, day });
    const result = await categoryInstance.save();
    return result;
};
const insertHot = async (categorys = [], day) => {
    const CategoryModel = mongoose_1.default.model(model_1.t_jcgs_category, hot_1.CategorySchema);
    const count = await CategoryModel.find({ day: day }).count();
    if (count) {
        logger.info(`数据库已经存在${day}的数据了，无需再插入数据`);
        return;
    }
    categorys.forEach(async (cate) => {
        const result = await insertCategory(cate, day);
        insertStocks(cate.stocks, result === null || result === void 0 ? void 0 : result._id);
    });
};
exports.insertHot = insertHot;
