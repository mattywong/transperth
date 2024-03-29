const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: ["webpack-hot-middleware/client", "./client/index.js"],
  output: {
    path: path.resolve(__dirname, "./wwwroot/build"),
    filename: "bundle.js",
    publicPath: "/build"
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
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
            plugins: ["react-hot-loader/babel"]
          }
        }
      }
    ]
  }
};
