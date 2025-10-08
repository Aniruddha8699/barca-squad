const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.football-data.org/v4",
      changeOrigin: true,
      secure: true,
      pathRewrite: { "^/api": "" },
      onProxyReq: (proxyReq) => {
        const token = "007ecd1015014a9c8931de6680ea7478";
        if (token) proxyReq.setHeader("X-Auth-Token", token);
      },
      logLevel: "debug",
    })
  );
};
