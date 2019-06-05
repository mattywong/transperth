import webpack from "webpack";
import path from "path";
import nodeExternals from "webpack-node-externals";

process.env.NODE_ENV = "production";

export default [
  // server
  {
    mode: process.env.NODE_ENV,
    target: "node",
    node: {
      __dirname: false
    },
    externals: [nodeExternals()],
    devtool: "eval-source-map",
    entry: { server: "./index" },
    output: {
      path: path.join(__dirname, "./dist"),
      filename: "[name].js",
      publicPath: "../"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    plugins: [
      //   new ExtractTextPlugin("[name].css"),
      new webpack.DefinePlugin({
        "process.env": { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
      }),
      new webpack.NamedModulesPlugin()
    ]
  }
];
