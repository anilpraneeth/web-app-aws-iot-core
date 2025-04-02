const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Add a rule to handle certificate files
            webpackConfig.module.rules.push({
                test: /\.(pem|crt|key)$/,
                use: 'raw-loader',
                include: path.resolve(__dirname, 'certificates'),
            });

            return webpackConfig;
        },
        resolve: {
            fallback: {
                "util": require.resolve("util/"),
                "url": require.resolve("url/"),
                "buffer": require.resolve("buffer/"),
                "process": require.resolve("process/browser"),
                "stream": require.resolve("stream-browserify"),
                "crypto": require.resolve("crypto-browserify"),
                "assert": require.resolve("assert/"),
                "http": require.resolve("stream-http"),
                "https": require.resolve("https-browserify"),
                "os": require.resolve("os-browserify/browser"),
                "path": require.resolve("path-browserify"),
                "fs": false,
                "tls": false,
                "net": false,
                "zlib": require.resolve("browserify-zlib"),
                "querystring": require.resolve("querystring-es3")
            }
        }
    }
}; 