const commonConfig = require("./webpack.config.js");
const CopyPlugin = require("copy-webpack-plugin");

const specificConfig = Object.assign({}, commonConfig);

specificConfig.output = {
    path: __dirname + "/dist/source/chrome"
};
specificConfig.plugins.push(
    new CopyPlugin({
        patterns: [
            { from: "./manifest.json" }
        ]
    })
);

module.exports = specificConfig;