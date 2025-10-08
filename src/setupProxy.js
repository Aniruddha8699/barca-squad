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
        const token = process.env.REACT_APP_FD_TOKEN;
        if (token) proxyReq.setHeader("X-Auth-Token", token);
      },
      logLevel: "debug",
    })
  );
};
