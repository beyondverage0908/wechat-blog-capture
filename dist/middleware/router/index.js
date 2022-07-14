"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAllowedMethods = exports.useRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const home_1 = __importDefault(require("./home"));
const page_1 = __importDefault(require("./page"));
const wechat_1 = __importDefault(require("./wechat"));
const eastmoney_1 = __importDefault(require("./eastmoney"));
const jiucaigongshe_1 = __importDefault(require("./jiucaigongshe"));
const router = new koa_router_1.default({ prefix: "/pac/api" });
router.use("/home", home_1.default.routes(), home_1.default.allowedMethods());
router.use("/page", page_1.default.routes(), page_1.default.allowedMethods());
router.use("/wechat", wechat_1.default.routes(), wechat_1.default.allowedMethods());
router.use("/eastmoney", eastmoney_1.default.routes(), eastmoney_1.default.allowedMethods());
router.use("/jiucaigongshe", jiucaigongshe_1.default.routes(), jiucaigongshe_1.default.allowedMethods());
router.get("/", (ctx) => {
    ctx.body = "welcome to here!!";
});
function useRoutes() {
    return router.routes();
}
exports.useRoutes = useRoutes;
function useAllowedMethods() {
    return router.allowedMethods();
}
exports.useAllowedMethods = useAllowedMethods;
