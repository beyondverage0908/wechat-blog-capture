const path = require("path");
const isProd = process.env.NODE_ENV === "production";
const prodPath = "/pingjun/share/wechat-blog-capture-for-win";

module.exports = {
  apps: [
    {
      name: "PROJECT_NAME",
      script: "src/index.ts",
      env: {
        TS_NODE_PROJECT: isProd
          ? path.resolve(prodPath, "source", "tsconfig.json")
          : path.resolve(__dirname, "tsconfig.json"),
      },
      wait_ready: true,
      exec_mode: "cluster",
      instances: 1,
    },
  ],
  deploy: {
    production: {
      user: "...",
      host: "...",
      ref: "...",
      repo: "...",
      path: prodPath,
      env: {
        NODE_ENV: "production",
      },
      "post-deploy": [
        "pnpm",
        "pm2 reload ecosystem.config.js --env production",
      ].join(" && "),
    },
  },
};
