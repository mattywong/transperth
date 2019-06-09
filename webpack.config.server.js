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
    entry: { server: "./server/index" },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].js",
      publicPath: "./"
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
  }
];
