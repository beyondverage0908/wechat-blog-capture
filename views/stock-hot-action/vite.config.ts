import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import WindiCSS from "vite-plugin-windicss";

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
  server: {
    port: 4000,
    cors: true, // 指定服务器应该监听哪个 IP 地址,如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    open: false,
    host: true,
    proxy: {
      "/pac/api": {
        // target: "http://111.229.62.79:3000",
        // target: "http://172.31.227.163:3000",
        target: "http://192.168.101.7:3000",
        changeOrigin: true,
        ws: false,
      },
    },
  },
});
