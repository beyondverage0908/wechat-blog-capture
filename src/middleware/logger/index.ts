import log4js, { Level } from "log4js";
import path from "path";
import type Koa from "koa";

type levelCategorys = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

const dirName = "info.log";
// 获取当前项目根目录下创建.logs目录
const _path = path.resolve(process.cwd(), `./logs/${dirName}`);

log4js.configure({
  appenders: {
    cheese: {
      // 设置类型为 dateFile：输入到文件 stdout: 控制台输出
      type: "dateFile",
      // 配置文件名
      filename: _path,
      // 指定编码格式为 utf-8
      encoding: "utf-8",
      // 配置 layout，此处使用自定义模式 pattern
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss} %p %c %h %m",
      },
      // 日志文件按日期（天）切割
      pattern: "yyyy-MM-dd",
      // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
      keepFileExt: true,
      // 输出的日志文件名是都始终包含 pattern 日期结尾
      alwaysIncludePattern: true,
    },
  },
  categories: {
    // 设置默认的 categories
    default: { appenders: ["cheese"], level: "debug" },
  },
});

class Logger {
  private readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  public debug(message: string) {
    const logger = log4js.getLogger(this.name);
    logger.level = log4js.levels.DEBUG;
    logger.debug(message);
  }
  public info(message: string) {
    const logger = log4js.getLogger(this.name);
    logger.level = log4js.levels.INFO;
    logger.info(message);
  }
  public trace(message: string) {
    const logger = log4js.getLogger(this.name);
    logger.level = log4js.levels.TRACE;
    logger.trace(message);
  }
  public warn(message: string) {
    const logger = log4js.getLogger(this.name);
    logger.level = log4js.levels.WARN;
    logger.warn(message);
  }
  public error(message: string) {
    const logger = log4js.getLogger(this.name);
    logger.level = log4js.levels.ERROR;
    logger.fatal(message);
  }
  public fatal(message: string) {
    const logger = log4js.getLogger(this.name);
    logger.level = log4js.levels.FATAL;
    logger.fatal(message);
  }
  public mark(message: string) {
    const logger = log4js.getLogger(this.name);
    logger.level = log4js.levels.MARK;
    logger.mark(message);
  }
  public log(message: string, level: Level = log4js.levels.ALL) {
    const logger = log4js.getLogger(this.name);
    logger.level = level;
    logger.trace(message);
  }
}

export function createLogger(name: string = "NormalLog") {
  return new Logger(name);
}
