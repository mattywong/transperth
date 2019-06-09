const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "eval-source-map",
  entry: { app: "./client/index.js" },
  output: {
    path: path.resolve(__dirname, "./wwwroot/build"),
    filename: "[name].min.js",
    publicPath: "/"
  },
  optimization: {
    runtimeChunk: {
      name: "runtime"
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: "vendor"
        }
      }
    },
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
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ],
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
