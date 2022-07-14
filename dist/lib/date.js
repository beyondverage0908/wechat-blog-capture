"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
exports.default = {
    format(date) {
        const fdate = new Date() || date;
        return (0, dayjs_1.default)(fdate).format("YYYY-MM-DD");
    },
    fullFormat(date) {
        const fdate = new Date() || date;
        return (0, dayjs_1.default)(fdate).format("YYYY-MM-DD HH:mm:ss");
    },
    range(startDate, endDate) {
        if (!startDate || !endDate)
            return [];
        const diff = (0, dayjs_1.default)(endDate).diff(startDate, "day");
        const range = Array.from({ length: diff }, (_, i) => {
            return (0, dayjs_1.default)(startDate).add(i, "day").format("YYYY-MM-DD");
        });
        return [...range, endDate];
    },
};
