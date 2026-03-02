module.exports = {
  apps: [
    {
      name: "lea-numerique",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/html/Lea-numerique",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
