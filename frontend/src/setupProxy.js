const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // API
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    }),
  );

  // Socket.IO
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      ws: true, // WebSocket support
    }),
  );
};
