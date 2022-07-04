"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const log4js_1 = __importDefault(require("log4js"));
const path_1 = __importDefault(require("path"));
const dirName = "info.log";
const _path = path_1.default.resolve(process.cwd(), `./logs/${dirName}`);
log4js_1.default.configure({
    appenders: {
        cheese: {
            type: "dateFile",
            filename: _path,
            encoding: "utf-8",
            layout: {
                type: "pattern",
                pattern: "%d{yyyy-MM-dd hh:mm:ss} %p %c %h %m",
            },
            pattern: "yyyy-MM-dd",
            keepFileExt: true,
            alwaysIncludePattern: true,
        },
    },
    categories: {
        default: { appenders: ["cheese"], level: "debug" },
    },
});
class Logger {
    constructor(name) {
        this.name = name;
    }
    debug(message) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = log4js_1.default.levels.DEBUG;
        logger.debug(message);
    }
    info(message) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = log4js_1.default.levels.INFO;
        logger.info(message);
    }
    trace(message) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = log4js_1.default.levels.TRACE;
        logger.trace(message);
    }
    warn(message) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = log4js_1.default.levels.WARN;
        logger.warn(message);
    }
    error(message) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = log4js_1.default.levels.ERROR;
        logger.fatal(message);
    }
    fatal(message) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = log4js_1.default.levels.FATAL;
        logger.fatal(message);
    }
    mark(message) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = log4js_1.default.levels.MARK;
        logger.mark(message);
    }
    log(message, level = log4js_1.default.levels.ALL) {
        const logger = log4js_1.default.getLogger(this.name);
        logger.level = level;
        logger.trace(message);
    }
}
function createLogger(name = "NormalLog") {
    return new Logger(name);
}
exports.createLogger = createLogger;
