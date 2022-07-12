"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = exports.StockSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.StockSchema = new mongoose_1.default.Schema({
    name: mongoose_2.SchemaTypes.String,
    code: mongoose_2.SchemaTypes.String,
    price: mongoose_2.SchemaTypes.String,
    percent: mongoose_2.SchemaTypes.String,
    time: mongoose_2.SchemaTypes.String,
    desc: mongoose_2.SchemaTypes.String,
    desc_link: mongoose_2.SchemaTypes.String,
    category_id: mongoose_2.SchemaTypes.ObjectId,
});
exports.CategorySchema = new mongoose_1.default.Schema({
    category: String,
    number: Number,
    day: mongoose_2.SchemaTypes.String,
});
