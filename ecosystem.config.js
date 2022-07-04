module.exports = {
  apps: [
    {
      name: "pachou",
      script: "./dist/main.js",
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: "development"
      },
      wait_ready: true,
      exec_mode: "cluster",
      instances: 1,
      max_restarts: 10
    },
  ]
};
