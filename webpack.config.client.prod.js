const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "eval-source-map",
  entry: ["./client/index.js"],
  output: {
    path: path.resolve(__dirname, "./wwwroot/build"),
    filename: "bundle.js",
    publicPath: "/"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,

          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
          sourceMap: false,
          output: {
            comments: false
          }
        }
      })
    ]
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
