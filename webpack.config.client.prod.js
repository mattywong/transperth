import webpack from "webpack";
import path from "path";

export default {
  mode: "production",
  devtool: "eval-source-map",
  entry: ["./client/index.js"],
  output: {
    path: path.resolve(__dirname, "./dist/wwwroot"),
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
