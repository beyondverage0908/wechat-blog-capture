"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEastmoneyJob = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const hq_1 = require("./hq");
const hangqing_1 = require("../../mongodb/eastmoney/hangqing");
const date_1 = __importDefault(require("../../lib/date"));
const hqEstmoneyJob = () => {
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.dayOfWeek = [1, 2, 3, 4, 5];
    rule.hour = [9, 10, 11, 13, 14];
    rule.second = 30;
    node_schedule_1.default.scheduleJob(rule, async () => {
        const today = date_1.default.format();
        const hqList = await (0, hq_1.getHq)();
        (0, hangqing_1.saveHqData)(hqList, today);
    });
};
const initEastmoneyJob = () => {
    hqEstmoneyJob();
};
exports.initEastmoneyJob = initEastmoneyJob;
