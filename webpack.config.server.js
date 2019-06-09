const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  target: "node",
  node: {
    __dirname: false
  },
  externals: [nodeExternals()],
  devtool: "eval-source-map",
  entry: { server: "./server/index" },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "server.js",
    publicPath: "./",
    library: "app",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env"]],
            plugins: [
              [
                "babel-plugin-styled-components",
                {
                  displayName: false
                }
              ],
              "@babel/plugin-transform-runtime",
              "dynamic-import-node"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
    }),
    new webpack.NamedModulesPlugin()
  ]
};
