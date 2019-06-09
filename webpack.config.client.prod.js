const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  devtool: "eval-source-map",
  entry: ["./client/index.js"],
  output: {
    path: path.resolve(__dirname, "./wwwroot"),
    filename: "bundle.js",
    publicPath: "/"
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, "./client"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env"]],
            plugins: [
              ["babel-plugin-styled-components", { displayName: false }]
            ]
          }
        }
      }
    ]
  }
};
