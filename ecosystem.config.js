module.exports = {
  apps: [
    {
      name: "pachou",
      script: "./dist/main.js",
      env: {
        NODE_ENV: "production"
      },
      wait_ready: true,
      exec_mode: "cluster",
      instances: 1,
      max_restarts: 10
    },
  ]
};
