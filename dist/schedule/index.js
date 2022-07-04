"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initScheduleJobs = void 0;
const index_1 = require("../works/eastmoney/index");
const jiucaigongshe_1 = require("../works/jiucaigongshe");
const initScheduleJobs = () => {
    (0, index_1.initEastmoneyJob)();
    (0, jiucaigongshe_1.initJiuCaiGongSheJob)();
};
exports.initScheduleJobs = initScheduleJobs;
