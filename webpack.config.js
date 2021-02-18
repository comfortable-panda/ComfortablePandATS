const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: process.env.NODE_ENV || "development",
    devtool: "inline-source-map",
    entry: {
        // popup: `${__dirname}/src/popup.ts`,
        content_script: `${__dirname}/src/content_script.ts`,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
        ],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new CopyPlugin({
            patterns:[
                {from: "./public", to: "./"}
            ],
        }),
    ]
}