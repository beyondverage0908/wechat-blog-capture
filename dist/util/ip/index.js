"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIp = void 0;
const ip_1 = __importDefault(require("ip"));
function getIp() {
    return ip_1.default.address();
}
exports.getIp = getIp;
