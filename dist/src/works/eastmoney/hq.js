"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHq = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const eastmoney_1 = require("../../../constant/urls/eastmoney");
const getHq = async () => {
    const data = await axios_1.default.get(eastmoney_1.mainUrl);
    const html = data.data;
    const $ = cheerio.load(html);
    const children = $("#hq-news-main .hq-news-con .hq-news-data");
    const hqList = [];
    children.each(function (_, ele) {
        const data = { name: "", price: "", change: "", percent: "" };
        data.name = $(ele).find(".nickname").text();
        $(ele)
            .find(".hq-news-value")
            .contents()
            .each((idx, element) => {
            if (idx === 0) {
                data.price = $(element).text();
            }
            else if (idx === 1) {
                data.change = $(element).text();
            }
            else if (idx === 2) {
                data.percent = $(element).text();
            }
        });
        hqList.push(data);
    });
    return hqList;
};
exports.getHq = getHq;
