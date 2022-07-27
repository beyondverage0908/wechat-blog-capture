"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initScheduleJobs = void 0;
const index_1 = require("../works/eastmoney/index");
const jiucaigongshe_1 = require("../works/jiucaigongshe");
const jobs_1 = require("../works/tonghuashun/jobs");
const logger_1 = require("../middleware/logger");
const logger = (0, logger_1.createLogger)();
const initScheduleJobs = () => {
    try {
        (0, index_1.initEastmoneyJob)();
        (0, jiucaigongshe_1.initJiuCaiGongSheJob)();
        (0, jobs_1.initTongHuaShunSchedule)();
    }
    catch (error) {
        logger.error(JSON.stringify(error));
    }
};
exports.initScheduleJobs = initScheduleJobs;
