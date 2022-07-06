"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
exports.default = {
    format(date) {
        return (0, dayjs_1.default)(date).format("YYYY-MM-DD");
    },
    fullFormat(date) {
        return (0, dayjs_1.default)(date).format("YYYY-MM-DD HH:mm:ss");
    },
};
