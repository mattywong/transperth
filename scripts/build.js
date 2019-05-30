import webpack from "webpack";
import webpackServerConfig from "../webpack.config.server.js"; // <-- Contains ES6+
import webpackClientConfig from "../webpack.config.js"; // <-- Contains ES6+

const serverCompiler = webpack(webpackServerConfig);
serverCompiler.run();

const clientCompiler = webpack(webpackClientConfig);
clientCompiler.run();
