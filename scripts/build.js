import webpack from "webpack";
import webpackServerConfig from "../webpack.config.server.js";
import webpackClientConfig from "../webpack.config.client.prod.js";

process.env.NODE_ENV = "production";

const serverCompiler = webpack(webpackServerConfig);
serverCompiler.run();

const clientCompiler = webpack(webpackClientConfig);
clientCompiler.run();
