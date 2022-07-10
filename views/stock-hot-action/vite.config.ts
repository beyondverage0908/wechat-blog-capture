import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  resolve: {
    alias: {
      "/@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4000,
    cors: true,
    open: false,
    proxy: {
      "/pac/api": {
        target: "http://111.229.62.79:3000",
        changeOrigin: true,
        ws: false,
      },
    },
  },
});
