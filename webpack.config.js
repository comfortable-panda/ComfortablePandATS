const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  devtool: "inline-source-map",
  entry: {
    background: `${__dirname}/src/background.ts`,
    content_script: `${__dirname}/src/content_script.ts`,
    subsakai: `${__dirname}/src/subsakai.ts`
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "./public", to: "./" },
        { from: "./_locales", to: "./_locales" }
      ]
    })
  ]
};