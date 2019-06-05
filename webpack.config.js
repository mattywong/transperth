import webpack from "webpack";
import path from "path";

export default {
  mode: process.env.NODE_ENV || "development",
  devtool: "eval-source-map",
  entry:
    process.env.NODE_ENV !== "production"
      ? ["webpack-hot-middleware/client", "./client/index.js"]
      : ["./client/index.js"],
  output: {
    path: path.resolve(__dirname, "./dist/wwwroot"),
    filename: "bundle.js",
    publicPath: "/"
  },
  plugins:
    process.env.NODE_ENV !== "production"
      ? [new webpack.HotModuleReplacementPlugin()]
      : [],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, "./client"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            plugins:
              process.env.NODE_ENV === "development"
                ? ["react-hot-loader/babel"]
                : []
          }
        }
      }
    ]
  }
};
