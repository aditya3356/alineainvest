const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy("/bars/ID", {
            target: "https://data.alpaca.markets/v1",
            secure: false,
            changeOrigin: true
        })
    );
} 