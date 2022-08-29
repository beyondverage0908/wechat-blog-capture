import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import WindiCSS from "vite-plugin-windicss";
import postcssToViewPort from "postcss-px-to-viewport";

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

// 设置别名
const alias: Record<string, string> = {
  "/@": pathResolve("src"),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths(),
    Components({ resolvers: [NaiveUiResolver()] }), // 为了NaiveUI进行按需引入
    WindiCSS(),
  ],
  resolve: {
    alias,
  },
  css: {
    postcss: {
      plugins: [
        postcssToViewPort({
          unitToConvert: "px", // 要转化的单位
          viewportWidth: 1920, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          exclude: [],
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
  server: {
    port: 4000,
    cors: true, // 指定服务器应该监听哪个 IP 地址,如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    open: false,
    host: true,
    proxy: {
      "/pac/api": {
        target: "http://111.229.62.79:3000",
        // target: "http://172.31.227.163:3000",
        // target: "http://192.168.101.7:3000",
        changeOrigin: true,
        ws: false,
      },
    },
  },
});
