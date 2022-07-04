"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEastmoneyJob = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const hq_1 = require("./hq");
const logger_1 = require("../../middleware/logger");
const logger = (0, logger_1.createLogger)("EastmoneyLog");
const hqEstmoneyJob = () => {
    node_schedule_1.default.scheduleJob("0 0 15 * * 1-5", async () => {
        const hqList = await (0, hq_1.getHq)();
        logger.mark("获取了行情数据");
        console.log(JSON.stringify(hqList));
    });
};
const initEastmoneyJob = () => {
    hqEstmoneyJob();
};
exports.initEastmoneyJob = initEastmoneyJob;
