"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainUrl = exports.getActionUrl = exports.countPcUrl = exports.domainUrl = void 0;
const date_1 = __importDefault(require("../../lib/date"));
exports.domainUrl = "https://www.jiucaigongshe.com";
exports.countPcUrl = "https://app.jiucaigongshe.com/jystock-app/api/v1/action/count-pc";
const getActionUrl = (dateString) => `${exports.domainUrl}/action/${date_1.default.format(dateString)}`;
exports.getActionUrl = getActionUrl;
exports.mainUrl = `${exports.domainUrl}`;
