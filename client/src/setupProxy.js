const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://54.83.110.27',
      target: 'http://localhost:4000',
      changeOrigin: true,
      
    })
  );
};